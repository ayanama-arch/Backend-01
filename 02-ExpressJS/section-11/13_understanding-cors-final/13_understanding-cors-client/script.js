const response = await fetch("http://localhost:4000/api", {
  method: "PATCH",
});
const data = await response.json();

console.log(data);
