
document.addEventListener("DOMContentLoaded", () => {

    cargarTipos();
    listarServicios();

    document.getElementById("form-servicio")
        .addEventListener("submit", guardarServicio);

    document.getElementById("btn-cancelar")
        .addEventListener("click", limpiarFormulario);

    document.getElementById("btn-recargar")
        .addEventListener("click", listarServicios);

});


// =====================================
// LISTAR SERVICIOS (READ)
// =====================================
async function listarServicios() {

    const tabla = document.getElementById("tabla-servicios");

    tabla.innerHTML = `
        <tr>
            <td colspan="5">Cargando...</td>
        </tr>
    `;

    try {

        const respuesta = await apiFetch("/servicios");
        const servicios = respuesta.data || [];

        tabla.innerHTML = "";

        if (servicios.length === 0) {
            tabla.innerHTML = `
                <tr>
                    <td colspan="5">No hay servicios registrados.</td>
                </tr>
            `;
            return;
        }

        servicios.forEach(servicio => {

            const fila = document.createElement("tr");

            fila.innerHTML = `
                <td>${servicio.id_servicio}</td>
                <td>${servicio.servicios_nombre}</td>
                <td>Bs. ${Number(servicio.servicios_precio_unitario).toFixed(2)}</td>
                <td>${servicio.servicio_tipo_descripcion || servicio.id_servicio_tipo}</td>
                <td>
                    <button class="btn-editar"
                        onclick="editarServicio(${servicio.id_servicio})">
                        Editar
                    </button>

                    <button class="btn-eliminar"
                        onclick="eliminarServicio(${servicio.id_servicio})">
                        Eliminar
                    </button>
                </td>
            `;

            tabla.appendChild(fila);
        });

    } catch (error) {

        console.error(error);

        tabla.innerHTML = `
            <tr>
                <td colspan="5">Error al cargar servicios.</td>
            </tr>
        `;
    }
}


// =====================================
// CARGAR TIPOS DE SERVICIO
// =====================================
async function cargarTipos() {

    const select = document.getElementById("id_servicio_tipo");

    try {

        const respuesta = await apiFetch("/servicio-tipos");
        const tipos = respuesta.data || [];

        tipos.forEach(tipo => {

            const opcion = document.createElement("option");

            opcion.value = tipo.id_servicio_tipo;
            opcion.textContent = tipo.servicio_tipo_descripcion;

            select.appendChild(opcion);
        });

    } catch (error) {

        console.error("Error al cargar tipos:", error);
    }
}


// =====================================
// REGISTRAR / ACTUALIZAR (CREATE / UPDATE)
// =====================================
async function guardarServicio(event) {

    event.preventDefault();

    const id = document.getElementById("id_servicio").value;

    const servicio = {
        servicios_nombre: document.getElementById("servicios_nombre").value.trim(),
        servicios_descripcion: document.getElementById("servicios_descripcion").value.trim(),
        servicios_imagen: document.getElementById("servicios_imagen").value.trim(),
        servicios_precio_unitario: Number(document.getElementById("servicios_precio_unitario").value),
        id_servicio_tipo: Number(document.getElementById("id_servicio_tipo").value)
    };

    const mensaje = document.getElementById("mensaje-form");
    const boton = document.getElementById("btn-guardar");

    boton.disabled = true;

    try {

        if (id) {

            // UPDATE
            await apiFetch(`/servicios/${id}`, {
                method: "PUT",
                body: JSON.stringify(servicio)
            });

            mensaje.innerHTML = `
                <p class="mensaje-exito">Servicio actualizado correctamente.</p>
            `;

        } else {

            // CREATE
            await apiFetch("/servicios", {
                method: "POST",
                body: JSON.stringify(servicio)
            });

            mensaje.innerHTML = `
                <p class="mensaje-exito">Servicio registrado correctamente.</p>
            `;
        }

        limpiarFormulario();
        listarServicios();

    } catch (error) {

        console.error(error);

        mensaje.innerHTML = `
            <p class="mensaje-error">${error.message}</p>
        `;

    } finally {

        boton.disabled = false;
    }
}

async function editarServicio(id) {

    try {
        const respuesta = await apiFetch(`/servicios/${id}`);
        const servicio = respuesta.data;

        document.getElementById("id_servicio").value = servicio.id_servicio;
        document.getElementById("servicios_nombre").value = servicio.servicios_nombre;
        document.getElementById("servicios_descripcion").value = servicio.servicios_descripcion || "";
        document.getElementById("servicios_imagen").value = servicio.servicios_imagen || "";
        document.getElementById("servicios_precio_unitario").value = servicio.servicios_precio_unitario;
        document.getElementById("id_servicio_tipo").value = servicio.id_servicio_tipo;

        document.getElementById("form-title").textContent = "Editar servicio";
        document.getElementById("btn-guardar").textContent = "Actualizar servicio";
        document.getElementById("btn-cancelar").hidden = false;

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });

    } catch (error) {

        alert("No se pudo cargar el servicio.");
        console.error(error);
    }
}


async function eliminarServicio(id) {
    const confirmar = confirm("¿Estás seguro de eliminar este servicio?");
    
    if (!confirmar) return;
    try {
        await apiFetch(`/servicios/${id}`, {
            method: "DELETE"
        });
        alert("Servicio eliminado correctamente.");
        listarServicios();
    } catch (error) {
        alert(error.message || "No se pudo eliminar el servicio.");
        console.error(error);
    }
}

function limpiarFormulario() {
    document.getElementById("form-servicio").reset();
    document.getElementById("id_servicio").value = "";
    document.getElementById("form-title").textContent = "Registrar servicio";
    document.getElementById("btn-guardar").textContent = "Guardar servicio";
    document.getElementById("btn-cancelar").hidden = true;
    document.getElementById("mensaje-form").innerHTML = "";
}
