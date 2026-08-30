FROM python:3.12.3-slim

WORKDIR /app

COPY ./requirements.txt /app/requirements.txt

RUN pip install --no-cache-dir --upgrade -r /app/requirements.txt

COPY . /app

CMD ["fastapi", "dev", "app/main.py", "--host", "0.0.0.0", "--port", "80"]