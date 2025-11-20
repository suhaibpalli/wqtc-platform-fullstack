# create_admin.py
from app.database import SessionLocal
from app.models.user import User
from app.core.security import get_password_hash

def create_super_user():
    db = SessionLocal()
    email = "admin@wqtc.com"
    password = "admin"  # Change this!
    
    # Check if exists
    existing = db.query(User).filter(User.email == email).first()
    if existing:
        print(f"User {email} already exists.")
        return

    new_user = User(
        email=email,
        username="admin",
        password_hash=get_password_hash(password),
        role="admin"
    )
    
    db.add(new_user)
    db.commit()
    print(f"Superuser created! Email: {email}, Password: {password}")
    db.close()

if __name__ == "__main__":
    create_super_user()