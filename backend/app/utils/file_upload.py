import os
import aiofiles
from fastapi import UploadFile
from datetime import datetime

async def save_upload_file(upload_file: UploadFile, destination: str) -> str:
    """Save uploaded file to destination directory"""
    os.makedirs(destination, exist_ok=True)
    
    # Generate unique filename
    timestamp = int(datetime.now().timestamp())
    filename = f"{timestamp}_{upload_file.filename}"
    file_path = os.path.join(destination, filename)
    
    # Save file
    async with aiofiles.open(file_path, 'wb') as out_file:
        content = await upload_file.read()
        await out_file.write(content)
    
    return filename
