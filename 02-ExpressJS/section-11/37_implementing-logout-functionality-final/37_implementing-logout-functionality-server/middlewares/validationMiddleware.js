export function validateUUID(paramName) {
  return (req, res, next) => {
    const id = req.params[paramName];
    if (!isValidUUID(id)) {
      return res
        .status(400)
        .json({ error: `${paramName} is not a valid UUID.` });
    }
    next();
  };
}

function isValidUUID(id) {
  const uuidRegex =
    /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(id);
}
