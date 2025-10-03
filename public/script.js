document.addEventListener("DOMContentLoaded", () => {
  const loginCard = document.getElementById("loginCard");
  const registCard = document.getElementById("registCard");

  document.getElementById("bejelentkezes").addEventListener("click", () => {
    loginCard.style.display = "block";
    registCard.style.display = "none";
  });

  document.getElementById("regisztracio").addEventListener("click", () => {
    registCard.style.display = "block";
    loginCard.style.display = "none";
  });

  document.getElementById("loginButton").addEventListener("click", async () => {
    let gmail = document.getElementById("loginGmail").value;
    let pass = document.getElementById("loginPassword").value;

    try {
      const response = await fetch("http://localhost:3000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: gmail,
          password: pass,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        console.log(data);
        alert("Sikeres bejelentkezés!");
      } else {
        console.log(data.message);
        alert("Hibás belépési adatok!");
      }
    } catch (e) {
      console.log(e);
      alert("Szerver nem elérhető!");
    }
  });

  document
    .getElementById("registButton")
    .addEventListener("click", async () => {
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      let gmail = document.getElementById("registGmail").value;
      let pass = document.getElementById("registPassword").value;
      let passAgain = document.getElementById("registPasswordAgain").value;

      let validPassword = pass.length >= 8 && /\d/.test(pass);
      let validPasswordAgain = passAgain.length >= 8 && /\d/.test(passAgain);

      if (!emailPattern.test(gmail) || !validPassword || !validPasswordAgain) {
        alert("Az Email és/vagy a Jelszó nem felel meg a követelménynek!");
        return;
      }

      if (pass !== passAgain) {
        alert("A két jelszó nem egyezik meg!");
        return;
      }

      try {
        const response = await fetch("http://localhost:3000/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: gmail,
            password: pass,
          }),
        });

        const data = await response.json();

        if (response.ok) {
          console.log(data.message);
          alert("Sikeres regisztráció!");
        } else {
          console.log(data.message);
          alert(data.message);
        }
      } catch (e) {
        console.log(e);
        alert("Nem sikerült csatlakozni a szerverhez!");
      }
    });
});
