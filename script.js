// Faz uma validação simples dos formulários antes do envio.
document.querySelectorAll("form").forEach(form => {

    form.addEventListener("submit", event => {

        const campos = form.querySelectorAll(
            "input[required], select[required]"
        );

        for (const campo of campos) {

            if (!campo.value.trim()) {

                event.preventDefault();

                alert("Preencha todos os campos.");

                campo.focus();

                return;
            }
        }


        const nota = form.querySelector(
            'input[name="nota"]'
        );


        if (
            nota &&
            (Number(nota.value) < 0 ||
             Number(nota.value) > 10)
        ) {

            event.preventDefault();

            alert("A nota deve estar entre 0 e 10.");

            nota.focus();
        }

    });

});
