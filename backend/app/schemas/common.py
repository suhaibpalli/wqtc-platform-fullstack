from pydantic import BaseModel
from typing import TypeVar, Generic, List

T = TypeVar('T')

class ResponseBase(BaseModel, Generic[T]):
    code: int = 200
    msg: str = "Success"
    result: T