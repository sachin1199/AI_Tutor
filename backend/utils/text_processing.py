import re

MAX_CHUNK_TOKENS = 400
CHUNK_OVERLAP = 50


def clean_text(text: str) -> str:
    text = re.sub(r'\s+', ' ', text)
    text = re.sub(r'[^\x00-\x7F]+', ' ', text)
    return text.strip()


def chunk_text(text: str, max_words: int = MAX_CHUNK_TOKENS, overlap: int = CHUNK_OVERLAP) -> list[str]:
    words = text.split()
    if len(words) <= max_words:
        return [text]

    chunks = []
    start = 0
    while start < len(words):
        end = start + max_words
        chunk = ' '.join(words[start:end])
        chunks.append(chunk)
        start += max_words - overlap

    return chunks


def is_too_short(text: str, min_words: int = 20) -> bool:
    return len(text.split()) < min_words
