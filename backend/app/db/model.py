from datetime import datetime
from sqlalchemy import ForeignKey, String, Integer, DateTime, func
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column, relationship

class Base(DeclarativeBase):
    pass

class User(Base):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    username: Mapped[str] = mapped_column(String(50), unique=True, nullable=False)
    email: Mapped[str] = mapped_column(String(100), unique=True, nullable=False)
    phone_number: Mapped[str] = mapped_column(String(20), unique=True, nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime, server_default=func.now())

class Organizer(Base):
    __tablename__ = "organizers"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    name: Mapped[str] = mapped_column(String(100), unique=True, nullable=False)
    email: Mapped[str] = mapped_column(String(100), unique=True, nullable=False)
    phone_number: Mapped[str] = mapped_column(String(20), unique=True, nullable=False)
    #created_at: Mapped[datetime] = mapped_column(DateTime, server_default=func.now())
    events: Mapped[list["Event"]] = relationship(back_populates="organizer")
class Event(Base):
    __tablename__ = "events"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    name: Mapped[str] = mapped_column(String(100), unique=True, nullable=False)
    description: Mapped[str] = mapped_column(String(500), nullable=False)
    date: Mapped[datetime] = mapped_column(DateTime, nullable=False)
    location: Mapped[str] = mapped_column(String(200), nullable=False)
    #created_at: Mapped[datetime] = mapped_column(DateTime, server_default=func.now().nullable=True)
    poster_url: Mapped[str] = mapped_column(String(1025), nullable=True)
    organizer_id: Mapped[int] = mapped_column(ForeignKey("organizers.id"), nullable=True)
    organizer: Mapped["Organizer"] = relationship(back_populates="events")