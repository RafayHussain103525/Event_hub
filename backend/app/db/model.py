from datetime import datetime, date as Pydate
from sqlalchemy import (
    ForeignKey,
    String,
    Integer,
    DateTime,
    UniqueConstraint,
    func,
    Date,
)
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column, relationship


class Base(DeclarativeBase):
    pass


class User(Base):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    username: Mapped[str] = mapped_column(String(50), unique=True)
    email: Mapped[str] = mapped_column(String(100), unique=True)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now()
    )
    hashed_password: Mapped[str] = mapped_column(String(255))
    phone_number: Mapped[str] = mapped_column(String(20), unique=True)


class Organizer(Base):
    __tablename__ = "organizers"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    name: Mapped[str] = mapped_column(String(100), unique=True)
    email: Mapped[str] = mapped_column(String(100), unique=True)
    phone_number: Mapped[str] = mapped_column(String(20), unique=True)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now()
    )
    events: Mapped[list["Event"]] = relationship(back_populates="organizer")
    hashed_password: Mapped[str] = mapped_column(String(255))


class Event(Base):
    __tablename__ = "events"
    __table_args__ = (
        UniqueConstraint("name", "organizer_id", name="uq_event_name_per_organizer"),
    )
    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    name: Mapped[str] = mapped_column(String(100), index=True)
    description: Mapped[str] = mapped_column(String(500))
    date: Mapped[Pydate] = mapped_column((Date), index=True)
    location: Mapped[str] = mapped_column(String(200), index=True)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now()
    )
    poster_url: Mapped[str] = mapped_column(String(1025), nullable=True)
    organizer_id: Mapped[int] = mapped_column(
        ForeignKey("organizers.id"), nullable=True
    )
    organizer: Mapped["Organizer"] = relationship(back_populates="events")
