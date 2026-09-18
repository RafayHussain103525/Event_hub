from fastapi import status 

class DomainException(Exception):
    status_code: int = status.HTTP_400_BAD_REQUEST
    detail: str = "Bad request"
    def __init__(self, detail: str | None = None):
        self.detail = detail or self.__class__.detail
        super().__init__(self.detail)

class BadRequestException(DomainException):
    status_code: int = status.HTTP_400_BAD_REQUEST
    detail: str = "Invalid request"

class NotFoundException(DomainException):
    status_code: int = status.HTTP_404_NOT_FOUND
    detail: str = "Resource not found"

class AlreadyExistsException(DomainException):
    status_code: int = status.HTTP_409_CONFLICT
    detail: str = "Resource already exists"

class InvalidCredentialsException(DomainException):
    status_code: int = status.HTTP_401_UNAUTHORIZED
    detail: str = "Invalid email or password"

class DatabaseException(DomainException):
    status_code: int = status.HTTP_500_INTERNAL_SERVER_ERROR
    detail: str = "Database error"

class ForbiddenException(DomainException):
    status_code: int = status.HTTP_403_FORBIDDEN
    detail: str = "You do not have permission to perform this action"