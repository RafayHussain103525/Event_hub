# locustfile.py
import random
import uuid
from datetime import date, timedelta

from locust import HttpUser, task, between

PASSWORD = "LoadTest#12345"
CITIES = ["karachi", "london", "dubai", "tokyo", "berlin"]


def _hex(n=10):
    return uuid.uuid4().hex[:n]


def _phone():
    return str(random.randint(2000000000, 9999999999))


class Organizer(HttpUser):
    """Signs up + logs in once, then creates and browses events."""
    wait_time = between(0.5, 2)
    weight = 1  # 1 organizer per 5 visitors

    def on_start(self):
        email = f"org_{_hex(12)}@loadtest.dev"
        creds = {"email": email, "password": PASSWORD}
        self.name = f"org_{_hex(10)}"

        self.client.post("/auth/signup/organizer", json={
            "name": self.name,
            "email": email,
            "phone_number": _phone(),
            "password": PASSWORD,
        }, name="/auth/signup/organizer")

        resp = self.client.post("/auth/login/organizer", json=creds, name="/auth/login/organizer")
        if resp.status_code == 200:
            data = resp.json()
            self.auth = {"Authorization": f"Bearer {data['access_token']}"}
            self.refresh = data["refresh_token"]
        else:
            self.auth, self.refresh = {}, None

        self.my_event_names = []

    @task(5)
    def create_event(self):
        name = f"event_{_hex(10)}"  # must be unique per organizer (DB constraint)
        with self.client.post("/events/", json={
            "name": name,
            "date": str(date.today() + timedelta(days=random.randint(1, 365))),
            "location": random.choice(CITIES),
            "description": "load-test event",
            "image_url": "https://example.com/poster.jpg",
        }, headers=self.auth, name="/events/ [create]", catch_response=True) as r:
            if r.status_code == 201:
                self.my_event_names.append(name)
            else:
                r.failure(f"create failed: {r.status_code}")

    @task(3)
    def my_events(self):
        self.client.get("/events/my_events", headers=self.auth, name="/events/my_events")

    @task(2)
    def events_by_organizer_name(self):
        self.client.get(f"/events/event_organizer_name/{self.name}",
                        name="/events/event_organizer_name/[name]")

    @task(1)
    def lookup_own_event_by_name(self):
        if self.my_event_names:
            self.client.get(f"/events/name/{random.choice(self.my_event_names)}",
                            name="/events/name/[name]")

    @task(1)
    def refresh_token(self):
        if self.refresh:
            self.client.post("/auth/refresh_token",
                             json={"refresh_token": self.refresh},
                             name="/auth/refresh_token")


class EventVisitor(HttpUser):
    """Anonymous/public read traffic + occasional signup/login."""
    wait_time = between(1, 3)
    weight = 5

    def on_start(self):
        if random.random() < 0.5:  # half the visitors register
            email = f"user_{_hex(12)}@loadtest.dev"
            creds = {"email": email, "password": PASSWORD}
            self.client.post("/auth/signup/user", json={
                "username": f"user_{_hex(10)}",
                "email": email,
                "phone_number": _phone(),
                "password": PASSWORD,
            }, name="/auth/signup/user")
            resp = self.client.post("/auth/login/user", json=creds, name="/auth/login/user")
            if resp.status_code == 200:
                data = resp.json()
                self.refresh = data["refresh_token"]
            else:
                self.refresh = None
        else:
            self.refresh = None

    @task(6)
    def all_events(self):
        self.client.get(f"/events/all_events?limit={random.choice([5, 10, 25])}&offset={random.randint(0, 50)}",
                        name="/events/all_events")

    @task(3)
    def by_location(self):
        self.client.get(f"/events/location/{random.choice(CITIES)}",
                        name="/events/location/[city]")

    @task(2)
    def by_date_range(self):
        start = date.today() + timedelta(days=random.randint(0, 30))
        end = start + timedelta(days=random.randint(1, 60))
        self.client.get(f"/events/date_range/{start}/{end}",
                        name="/events/date_range/[start]/[end]")

    @task(2)
    def event_details(self):
        resp = self.client.get("/events/all_events?limit=10", name="/events/all_events (for ids)")
        events = resp.json() if resp.status_code == 200 else []
        if events:
            self.client.get(f"/events/{random.choice(events)['id']}", name="/events/[id]")

    @task(1)
    def refresh_token(self):
        if self.refresh:
            self.client.post("/auth/refresh_token",
                             json={"refresh_token": self.refresh},
                             name="/auth/refresh_token")