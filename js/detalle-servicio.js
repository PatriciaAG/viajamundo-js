
document.addEventListener("DOMContentLoaded", () => {
    cargarDetalleServicio();
});

async function cargarDetalleServicio() {

    const contenedor = document.getElementById("detalle-container");

    // Obtener el id desde la URL
    const parametros = new URLSearchParams(window.location.search);
    const id = parametros.get("id");

    if (!id) {
        contenedor.innerHTML = `
            <p>No se especificó un servicio.</p>
            <a href="index.html#services">Volver a servicios</a>
        `;
        return;
    }

    try {

        // Consultar el servicio a través de la API
        const respuesta = await apiFetch(`/servicios/${id}`);

        const servicio = respuesta.data;

        // Mostrar información
        contenedor.innerHTML = `
            <div class="detalle-servicio-card">

                <img 
                    src="assets/images/servicios/${servicio.servicios_imagen || 'servicio.png'}"
                    alt="${servicio.servicios_nombre}"
                    class="detalle-servicio-img"
                >

                <div class="detalle-servicio-info">

                    <h1 class="montserrat-title">
                        ${servicio.servicios_nombre}
                    </h1>

                    <p class="montserrat-content">
                        ${servicio.servicios_descripcion || "Sin descripción disponible"}
                    </p>

                    <p class="detalle-precio">
                        $us. ${Number(servicio.servicios_precio_unitario).toFixed(2)}
                    </p>

                    <button onclick="volverServicios()">
                        Volver a servicios
                    </button>

                </div>

            </div>
        `;

    } catch (error) {

        console.error("Error al consultar el servicio:", error);

        contenedor.innerHTML = `
            <h2>Servicio no encontrado</h2>
            <button onclick="volverServicios()">
                Volver
            </button>
        `;
    }
}

function volverServicios() {
    window.location.href = "index.html#services";
}
