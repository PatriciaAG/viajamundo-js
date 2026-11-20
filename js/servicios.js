
document.addEventListener("DOMContentLoaded", () => {
    cargarServicios();
});

async function cargarServicios() {
    const contenedor = document.getElementById("service-items");

    try {
        const respuesta = await apiFetch("/servicios");
        const servicios = respuesta.data;

        contenedor.innerHTML = "";

        if (!servicios || servicios.length === 0) {
            contenedor.innerHTML = "<p>No hay servicios disponibles.</p>";
            return;
        }

        servicios.forEach(servicio => {
            const card = document.createElement("div");
            card.classList.add("service-item-card");

            card.innerHTML = `
                <div class="service-item-card_info">
                    <img 
                        src="assets/images/servicios/${servicio.servicios_imagen || 'servicio'}.png"
                        alt="${servicio.servicios_nombre}"
                    >

                    <h3 class="montserrat-title">
                        ${servicio.servicios_nombre}
                    </h3>

                    <p class="montserrat-content">
                        ${servicio.servicios_descripcion || ""}
                    </p>

                    <p class="price montserrat-title">
                        $us. ${Number(servicio.servicios_precio_unitario).toFixed(2)}
                    </p>

                    <button 
                        class="btn-detalle"
                        onclick="verDetalleServicio(${servicio.id_servicio})">
                        Ver detalle
                    </button>
                </div>
            `;

            contenedor.appendChild(card);
        });

    } catch (error) {
        console.error("Error al cargar servicios:", error);

        contenedor.innerHTML = `
            <p>No se pudieron cargar los servicios.</p>
        `;
    }
}

function verDetalleServicio(id) {
    window.location.href = `servicios.html?id=${id}`;
}
