# Understanding Character Encoding

## Character Sets

- A **character set** is the collection of letters, digits, symbols, and control codes used in a writing system.
- Each character is assigned a **unique number** (called a _code point_).

---

## Unicode

- A **universal standard** for representing and encoding characters from almost every writing system in the world.
- Covers modern scripts, historical scripts, symbols, and emojis.
- Latest version (15.1) defines **149,813 characters**.
- Example:

  - Character `A` → Unicode code point `U+0041`

---

## ASCII (American Standard Code for Information Interchange)

- One of the earliest character sets (1960s).
- Defines **128 characters**:

  - English letters, digits, punctuation, and some control codes (newline, tab, etc.).

- Unicode was designed to extend ASCII, so **ASCII is a subset of Unicode**.

  - Example: ASCII `A` = Unicode `U+0041`

---

## Character Encoding

- A **character encoding** specifies _how code points are stored as bytes_.
- It maps numbers (Unicode code points) → sequences of 0s and 1s.

**Example:**
Character `A` (U+0041)

- In **UTF-8** → stored as `01000001` (1 byte)
- In **UTF-16** → stored as `00000000 01000001` (2 bytes)

---

## Common Encodings

- **UTF-8**: Most widely used, variable-length (1–4 bytes), backward compatible with ASCII.
- **UTF-16**: Uses 2 or 4 bytes per character.
- **UTF-32**: Uses fixed 4 bytes per character (simple but memory-heavy).

---

## Encoders & Decoders

- **Encoder**: Converts meaningful characters into binary sequences.

  - `Hello` → `01001000 01100101 01101100 01101100 01101111`

- **Decoder**: Converts binary sequences back into meaningful characters.

  - `01001000 01100101 01101100 01101100 01101111` → `Hello`

---

### Key Point

You must **always specify the encoding** when storing or transmitting text.
Otherwise, different systems may interpret the same bytes differently and produce gibberish.

---

With this, you’ve got the full ladder: **Character set → Unicode code point → Encoding (UTF-8/16/32) → Binary data → Decoding back to characters.**
