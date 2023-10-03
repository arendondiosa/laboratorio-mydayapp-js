export const sayHello = (text) => {
  return text;
};

export const validarListaTareas = () => {
  const main = document.querySelector("#main");
  const footer = document.querySelector("#footer");

  const contenedorTareas = document.getElementsByClassName("todo-list");
  const tareas = contenedorTareas[0].children;

  if (tareas.length == 0) {
    main.classList.add("inactive");
    footer.classList.add("inactive");
  } else {
    main.classList.remove("inactive");
    footer.classList.remove("inactive");
  }
};
export const listernerCheckboxComplete = () => {
  const checkboxCompletedList = document.querySelectorAll(".toggle");
  checkboxCompletedList.forEach((checkbox) => {
    checkbox.addEventListener("click", () => {
      const checkboxPadre = checkbox.parentNode.parentNode;
      checkboxPadre.classList.toggle("completed");
      checkboxPadre.classList.toggle("pendiente");

      const tareaId = checkboxPadre.id;
      const tareaString = localStorage.getItem("mydayapp-js");
      let tareasArray = JSON.parse(tareaString);
      tareasArray = tareasArray.map((tarea) => {
        if (tarea.id === tareaId) {
          tarea.completed = !tarea.completed;
        }
        return tarea;
      });
      localStorage.setItem("mydayapp-js", JSON.stringify(tareasArray));
      contadorFooter();
    });
  });
};

export const listennerDobleClick = () => {
  const editTareaList = document.querySelectorAll(".nombre-tarea");
  editTareaList.forEach((tarea) => {
    const contenedorTarea = tarea.parentNode.parentNode;
    const edicion = contenedorTarea.querySelector(".edit");
    const valorOriginal = edicion.value;
    tarea.addEventListener("dblclick", () => {
      contenedorTarea.classList.toggle("editing");
      const end = edicion.value.length;
      edicion.setSelectionRange(end, end);
      edicion.focus();
      edicion.addEventListener("keyup", (event) => {
        //Guardar edición al presionar "Enter"//
        if (event.key === "Enter") {
          let tareaEditada = edicion.value;
          tareaEditada = tareaEditada.trim();
          if (tareaEditada.length > 0) {
            tarea.innerText = tareaEditada;
            contenedorTarea.classList.remove("editing");
          }
        } else if (event.key === "Escape") {
          //al presionar "Escape" sale del modo edición y se retorna el valor original//
          edicion.value = valorOriginal;
          contenedorTarea.classList.remove("editing");
        }
      });
    });
  });
};
//Agregar contador al footer

export const contadorFooter = () => {
  const tareasPendientes = document.querySelectorAll(".pendiente");
  const numeroTareas = tareasPendientes.length;
  const tareasFooter = document.querySelector(".todo-count");
  tareasFooter.innerHTML = `<strong>${numeroTareas}</strong> ${
    numeroTareas == 1 ? "item" : "items"
  } left`;
};

//Quitar tareas completas

export const quitarTarea = () => {
  const botonLimpiar = document.querySelector(".clear-completed");
  botonLimpiar.addEventListener("click", () => {
    const tareasCompletas = document.querySelectorAll(".completed");
    tareasCompletas.forEach((tarea) => {
      tarea.remove();
      validarListaTareas();
    });
  });
};
//Obtener tareas del storage//

export const getTareas = () => {
  const tareas = localStorage.getItem("mydayapp-js") || "[]";
  const objetoTareas = JSON.parse(tareas);
  objetoTareas.forEach((tarea) => {
    renderizarTarea(tarea.title, tarea.completed, tarea.id);
  });
};

export const renderizarTarea = (inputNuevaTarea, completa, idTarea) => {
  const htmlNuevoElemento = `<li class = "tarea ${
    completa ? "completed" : "pending"
  }" id = "${idTarea}" >
      <div class="view">
        <input class="toggle" type="checkbox" ${completa ? "checked" : ""} />
        <label class = "nombre-tarea">${inputNuevaTarea}</label>
        <button class="destroy"></button>
      </div>
      <input class="edit" value="${inputNuevaTarea}" />
    </li>`;
  const listaTareas = document.querySelector("#todo-list");
  listaTareas.innerHTML = listaTareas.innerHTML + htmlNuevoElemento;
  validarListaTareas();
  listernerCheckboxComplete();
  listennerDobleClick();
  contadorFooter();
  quitarTarea();
  eliminarTarea();
};
//eliminar tarea//

export const eliminarTarea = () => {
  const botonesEliminar = document.querySelectorAll(".destroy");

  botonesEliminar.forEach((boton) => {
    boton.addEventListener("click", () => {
      const selectorTarea = boton.parentNode.parentNode;
      const tareaId = selectorTarea.id;
      const tareaString = localStorage.getItem("mydayapp-js");
      let tareasArray = JSON.parse(tareaString);
      tareasArray = tareasArray.filter((tarea) => tarea.id !== tareaId);
      localStorage.setItem("mydayapp-js", JSON.stringify(tareasArray));
      selectorTarea.remove();
    });
  });
};
