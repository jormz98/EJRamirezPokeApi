const d = document;

const inputs = d.querySelectorAll(".inp");


inputs.forEach(input => {
    input.addEventListener("focus", () => {
        input.parentNode.querySelector(".labelHolder").classList.add("lblFocus");
    })
    input.addEventListener("blur", (e) => {
        if (e.target.value == "") e.target.value = ""
        input.parentNode.querySelector(".labelHolder").classList.remove("lblFocus");
    })

})


var banderaGetAll = true

var banderaGetById = true



var paginaActual = 1;


const numberRegisters = d.getElementById("numberRegisters");

const containerCards = d.querySelector("#containerCards");

const tmptCard = d.getElementById("tmptCard");

const fgTemplateCard = d.createDocumentFragment();

const containerFooter = d.getElementById("containerFooter");

const InfoRegistros = d.getElementById("InfoRegistros");

const btnPrevious = d.getElementById("btnPrevious");

const btnNext = d.getElementById("btnNext");

const containerPaginador = d.getElementById("containerPaginador");

const fgPaginador = d.createDocumentFragment();


const typeRegisters = d.getElementById("typeRegisters")


const inputSearch = d.getElementById("inputSearch")

const btnSearch = d.getElementById("btnSearch")


const countRegisters = d.getElementById("countRegisters")





const colorsByType = {
    normal: "rgb(5, 0, 91",
    fighting: "rgb(183, 7, 7",
    flying: "rgb(169, 240, 247",
    poison: "rgb(0, 83, 11",
    ground: "rgb(91, 67, 1",
    rock: "rgb(43, 32, 1",
    bug: "rgb(189, 255, 66",
    ghost: "rgb(166, 191, 212",
    steel: "rgb(139, 139, 139",
    fire: "rgb(228, 60, 6",
    water: "rgb(11, 224, 216",
    grass: "rgb(63, 193, 16",
    electric: "rgb(236, 227, 19",
    psychic: "rgb(161, 19, 236",
    ice: "rgb(13, 141, 198",
    dragon: "rgb(255, 32, 32",
    dark: "rgb(24, 19, 19",
    fairy: "rgb(253, 0, 186",
    stellar: "rgb(0, 255, 246",
    unknown: "rgb(152, 11, 56",
    shadow: "rgb(90, 21, 164"
}





inputSearch.addEventListener("keyup", (e) => {
    if (e.key == 'Enter') btnSearch.click()
})


btnSearch.addEventListener("click", () => {
    if (banderaGetAll) {
        banderaGetAll = false
        if (inputSearch.value.trim() !== "") {
            GetPokeByName(inputSearch.value.trim())
        } else {
            GetAllPokeApi(1)
        }
        banderaGetAll = true
    } else {
        alert("Servicio en proceso, espere porfavor")
    }
})


btnNext.addEventListener("click", () => {
    GetAllPokeApi(paginaActual + 1)
})

btnPrevious.addEventListener("click", () => {
    GetAllPokeApi(paginaActual - 1)
})

numberRegisters.addEventListener("change", (e) => {
    if (banderaGetAll) {
        GetAllPokeApi(1)
    } else {
        e.preventDefault()
        alert("Servicio en proceso, espere porfavor")
    }
})





typeRegisters.addEventListener("change", async (e) => {


    if (banderaGetAll) {

        banderaGetAll = false

        if (e.target.value == "") {
            await GetAllPokeApi(1)
        } else {
            d.getElementById("numberRegisters").style.display = "none"
            //d.getElementById("containerInput").style.display = "none"
            await GetAllPokesByType(e.target.value)
        }


        banderaGetAll = true

    } else {

        e.preventDefault()

        alert("Servicio en proceso, espere porfavor")

    }
})



const GetAllPokesByType = async (urlPT) => {

    countRegisters.innerHTML = ""

    containerFooter.style.display = "none";

    containerCards.innerHTML = `<div class="spinner-border text-warning" role="status">
                                        <span class="visually-hidden">Loading...</span>
                                    </div>`;

    const fDataPokesByType = new FormData()

    fDataPokesByType.append("url", urlPT)

    let url = "Pokemons/GetAllByType"


    const responsePokesByType = await fetch(url, { method: 'POST', body: fDataPokesByType })

    if (responsePokesByType.status == 200) {

        const responsePokesByTypeJson = await responsePokesByType.json()

        containerCards.innerHTML = "";

        containerPaginador.innerHTML = ""

        countRegisters.innerHTML = `<b> ${responsePokesByTypeJson.results.length} </b> pokemon de tipo <b> ${responsePokesByTypeJson.pokemontype} </b>`

        let color = responsePokesByTypeJson.pokemontype

        responsePokesByTypeJson.results.forEach(p => {

            const cloneCard = tmptCard.content.cloneNode(true);

            let pokemonName = p.name.charAt(0).toUpperCase() + p.name.slice(1);


            cloneCard.querySelector(".namePoke").textContent = pokemonName
            cloneCard.querySelector(".fotoPoke").src = p.fotoPokemon
            cloneCard.querySelector(".fotoPoke").alt = p.name
            cloneCard.querySelector(".btnPlus").dataset.urlid = p.url

            cloneCard.querySelector(".card").style.background = `linear-gradient(180deg, ${colorsByType[color]}, 0) 0%, ${colorsByType[color]}, 0.1612977954853817) 68%, ${colorsByType[color]}, 0.6514938739167542) 100%)` 


            cloneCard.querySelector(".btnPlus").addEventListener("click", async (e) => {



                if (banderaGetById) {


                    banderaGetById = false

                    e.target.innerHTML = `<div class="spinner-border text-warning" role="status">
                                                <span class="visually-hidden">Loading...</span>
                                          </div>`


                    await GetByIdPokeApi(p.id)

                    e.target.innerHTML = "Saber mas"

                    $('#exampleModal').modal('show');

                    banderaGetById = true

                } else {
                    alert("servicio ocupado, espere un momento porfavor")
                }


            })


            fgTemplateCard.appendChild(cloneCard)

        })


        containerCards.appendChild(fgTemplateCard)

    }




}







const GetAllPokeApi = async (nPagina) => {

    d.getElementById("numberRegisters").style.display = "block"
    //d.getElementById("containerInput").style.display = "flex"


    countRegisters.innerHTML = ""

    containerFooter.style.display = "none";

    containerCards.innerHTML = `<div class="spinner-border text-warning" role="status">
                                        <span class="visually-hidden">Loading...</span>
                                    </div>`;

    let url = "Pokemons/GetAll"


    paginaActual = Number(nPagina)

    let pagina = paginaActual

    let getNumRegisters = Number(numberRegisters.value) <= 0 ? 10 : Number(numberRegisters.value)


    const fdata = new FormData();
    fdata.append("numRegisters", getNumRegisters)
    fdata.append("pagina", pagina)


    const response = await fetch(url, { method: 'POST', body: fdata })

    if (response.status == 200) {


        const responseJson = await response.json()

        containerCards.innerHTML = "";

        containerPaginador.innerHTML = ""



        responseJson.results.forEach(pokemon => {

            const cloneTmptCard = tmptCard.content.cloneNode(true);

            let pokemonName = pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1);

            cloneTmptCard.querySelector(".namePoke").textContent = pokemonName
            cloneTmptCard.querySelector(".fotoPoke").src = pokemon.fotoPokemon != null ? pokemon.fotoPokemon : "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQI0FHKKm3YXfkiunva6Nk9C-Jc5OrD_qMhrw&s"
            cloneTmptCard.querySelector(".fotoPoke").alt = pokemon.name
            cloneTmptCard.querySelector(".btnPlus").dataset.urlid = pokemon.url

            let color = pokemon.types[0].nameType

            cloneTmptCard.querySelector(".card").style.background = `linear-gradient(180deg, ${colorsByType[color]}, 0) 0%, ${colorsByType[color]}, 0.1612977954853817) 68%, ${colorsByType[color]}, 0.6514938739167542) 100%)` 

            cloneTmptCard.querySelector(".btnPlus").addEventListener("click", async (e) => {

                  
                if (banderaGetById) {


                    banderaGetById = false

                    e.target.innerHTML = `<div class="spinner-border text-warning" role="status">
                                                <span class="visually-hidden">Loading...</span>
                                          </div>`


                    await GetByIdPokeApi(pokemon.id)

                    e.target.innerHTML = "Saber mas"

                    $('#exampleModal').modal('show');

                    banderaGetById = true

                } else {
                    alert("servicio ocupado, espere un momento porfavor")
                }


            })

            fgTemplateCard.appendChild(cloneTmptCard)

        })

        containerCards.appendChild(fgTemplateCard)


        InfoRegistros.textContent = `Mostrando ${numberRegisters.value} de ${responseJson.count} registros`;

        btnPrevious.dataset.urlprevious = responseJson.previous
        btnNext.dataset.urlnext = responseJson.next

        if (responseJson.previous == null) { btnPrevious.style.visibility = "hidden" } else { btnPrevious.style.visibility = "visible" }
        if (responseJson.next == null) { btnNext.style.visibility = "hidden" } else { btnNext.style.visibility = "visible" }


        numberRegisters.dataset.urlactual = responseJson.urlActual


        //Paginador

        let numeroInicio = 1;

        if ((nPagina - 4) > 1) { numeroInicio = nPagina - 4 }

        let numeroFin = numeroInicio + 9

        if (numeroFin > responseJson.totalPaginas) { numeroFin = responseJson.totalPaginas }



        const aPageInicio = d.createElement("a")

        aPageInicio.classList.add("pageInOut")

        aPageInicio.textContent = "Inicio"

        aPageInicio.addEventListener("click", () => {
            GetAllPokeApi(1)
        })

        fgPaginador.appendChild(aPageInicio)



        for (let i = numeroInicio; i <= numeroFin; i++) {

            const aPage = d.createElement("a")

            aPage.classList.add("page")

            aPage.textContent = i;

            if (paginaActual == i) {
                aPage.classList.add("pageActive")
            } else {
                aPage.addEventListener("click", () => {
                    GetAllPokeApi(i)
                })
            }

            fgPaginador.appendChild(aPage)
        }




        const aPageFin = d.createElement("a")

        aPageFin.classList.add("pageInOut")

        aPageFin.textContent = "Fin"

        aPageFin.addEventListener("click", () => {
            GetAllPokeApi(responseJson.totalPaginas)
        })

        fgPaginador.appendChild(aPageFin)



        containerPaginador.appendChild(fgPaginador)


        containerFooter.style.display = "flex";

    }

}






const GetAllTypes = async () => {

    typeRegisters.innerHTML = `<option value="">Todos</option>`

    let url = "Pokemons/TypesGetAll"

    const responseTypes = await fetch(url, { method: 'POST' })

    if (responseTypes.status == 200) {


        const resTypesJson = await responseTypes.json()


        resTypesJson.results.forEach(type => {
            const op = d.createElement("option")

            op.value = type.url
            op.innerText = type.name

            typeRegisters.appendChild(op)

        })

    }

}






GetAllTypes();
GetAllPokeApi(paginaActual);






const containerBodyModal = d.getElementById("containerBodyModal")

const contentModal = d.getElementById("contentmodal")

const containerInfoPokemon = d.querySelector(".containerInfoPokemon")

const exampleModalLabel = d.querySelector("#exampleModalLabel")

const imgPokemon = d.getElementById("imgPokemon")

//const containerInfoPokemon = d.getElementById("containerInfoPokemon")


const containerPagImages = d.getElementById("containerPagImages")



const GetByIdPokeApi = async (idPokemon) => {


    document.getElementById("containerInfoPokemon").innerHTML = ""

    containerPagImages.innerHTML = ""

    imgPokemon.src = ""

    const fdataGBId = new FormData()

    fdataGBId.append("idPokemon", idPokemon)

    let url = "Pokemons/GetById"

    const responseGetById = await fetch(url, { method: 'POST', body: fdataGBId })

    if (responseGetById.status == 200) {

        const responseGBIJson = await responseGetById.json()


        exampleModalLabel.innerHTML = responseGBIJson.name.charAt(0).toUpperCase() + responseGBIJson.name.slice(1);

        imgPokemon.src = responseGBIJson.fotoPokemon != null ? responseGBIJson.fotoPokemon : "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQI0FHKKm3YXfkiunva6Nk9C-Jc5OrD_qMhrw&s"



       
        if (responseGBIJson.front_defaultGif != null) {
            let labelImg = d.createElement("label")
            labelImg.classList.add("lblImg")

            let inputImg = d.createElement("input")
            inputImg.classList.add("inpImg")
            inputImg.type = "radio"
            inputImg.name = "image"
            inputImg.dataset.urlimage = responseGBIJson.front_defaultGif

            labelImg.appendChild(inputImg)

            let imageImg = d.createElement("img")
            imageImg.src = responseGBIJson.front_defaultGif

            labelImg.appendChild(imageImg)

            containerPagImages.appendChild(labelImg)
        }



        if (responseGBIJson.back_defaultGif != null) {
            let labelImg = d.createElement("label")
            labelImg.classList.add("lblImg")

            let inputImg = d.createElement("input")
            inputImg.classList.add("inpImg")
            inputImg.type = "radio"
            inputImg.name = "image"
            inputImg.dataset.urlimage = responseGBIJson.back_defaultGif

            labelImg.appendChild(inputImg)

            let imageImg = d.createElement("img")
            imageImg.src = responseGBIJson.back_defaultGif

            labelImg.appendChild(imageImg)

            containerPagImages.appendChild(labelImg)
        }


        if (responseGBIJson.front_default3D != null) {
            let labelImg = d.createElement("label")
            labelImg.classList.add("lblImg")

            let inputImg = d.createElement("input")
            inputImg.classList.add("inpImg")
            inputImg.type = "radio"
            inputImg.name = "image"
            inputImg.dataset.urlimage = responseGBIJson.front_default3D

            labelImg.appendChild(inputImg)

            let imageImg = d.createElement("img")
            imageImg.src = responseGBIJson.front_default3D

            labelImg.appendChild(imageImg)

            containerPagImages.appendChild(labelImg)
        }


        if (responseGBIJson.front_defaultPng != null) {
            let labelImg = d.createElement("label")
            labelImg.classList.add("lblImg")

            let inputImg = d.createElement("input")
            inputImg.classList.add("inpImg")
            inputImg.type = "radio"
            inputImg.name = "image"
            inputImg.dataset.urlimage = responseGBIJson.front_defaultPng

            labelImg.appendChild(inputImg)

            let imageImg = d.createElement("img")
            imageImg.src = responseGBIJson.front_defaultPng

            labelImg.appendChild(imageImg)

            containerPagImages.appendChild(labelImg)
        }


        if (responseGBIJson.back_defaultPng != null) {
            let labelImg = d.createElement("label")
            labelImg.classList.add("lblImg")

            let inputImg = d.createElement("input")
            inputImg.classList.add("inpImg")
            inputImg.type = "radio"
            inputImg.name = "image"
            inputImg.dataset.urlimage = responseGBIJson.back_defaultPng

            labelImg.appendChild(inputImg)

            let imageImg = d.createElement("img")
            imageImg.src = responseGBIJson.back_defaultPng

            labelImg.appendChild(imageImg)

            containerPagImages.appendChild(labelImg)
        }


        if (responseGBIJson.fotoPokemon != null) {
            let labelImg = d.createElement("label")
            labelImg.classList.add("lblImg")

            let inputImg = d.createElement("input")
            inputImg.classList.add("inpImg")
            inputImg.type = "radio"
            inputImg.name = "image"
            inputImg.dataset.urlimage = responseGBIJson.fotoPokemon

            labelImg.appendChild(inputImg)

            let imageImg = d.createElement("img")
            imageImg.src = responseGBIJson.fotoPokemon

            labelImg.appendChild(imageImg)

            containerPagImages.appendChild(labelImg)
        }


        //d.getElementById("pTipos").innerHTML = `<b>Tipos: </b> ${responseGBIJson.typesString}`

        d.getElementById("pTipos").innerHTML = `<b>Tipos: </b>`


        responseGBIJson.types.forEach(tipo => {

            const btnType = d.createElement("button")

            btnType.classList.add("btnType")

            btnType.dataset.urltipo = tipo.url

            btnType.dataset.ntipo = tipo.nameType

            btnType.textContent = tipo.nameType

            let color = tipo.nameType.toLowerCase()


            btnType.style.backgroundColor = `${colorsByType[color]})` 

           

            d.getElementById("pTipos").appendChild(btnType)

        })



        responseGBIJson.stats.forEach(stat => {
            const parrafoInfo = d.createElement("p")

            parrafoInfo.classList.add("namePokemonM")

            parrafoInfo.innerHTML = `<b>${stat.nameStat}: </b> ${stat.base_stat} %`

            document.getElementById("containerInfoPokemon").appendChild(parrafoInfo)

            const progressInfo = d.createElement("progress")

            progressInfo.max = 100

            progressInfo.value = stat.base_stat

            progressInfo.style.accentColor = `${colorsByType[responseGBIJson.types[0].nameType.toLowerCase()]})`

            document.getElementById("containerInfoPokemon").appendChild(progressInfo)

            document.getElementById("containerInfoPokemon").scrollTop = 0
        })



        contentModal.style.background = `linear-gradient(180deg, ${colorsByType[responseGBIJson.types[0].nameType.toLowerCase()]}, 0) 0%, ${colorsByType[responseGBIJson.types[0].nameType.toLowerCase()]}, 0.1612977954853817) 68%, ${colorsByType[responseGBIJson.types[0].nameType.toLowerCase()]}, 0.6514938739167542) 100%)`



    }

}




containerPagImages.addEventListener("click", (e) => {
    if (e.target.tagName == 'INPUT') {
        let url = e.target.dataset.urlimage

        imgPokemon.src = url

    }
})




const parrafoTiposPokemon = d.getElementById("pTipos")

parrafoTiposPokemon.addEventListener("click", async (e) => {
    if (e.target.tagName == 'BUTTON') {

        if (banderaGetAll) {

            banderaGetAll = false

            let nombreTipo = e.target.dataset.ntipo

            e.target.innerHTML = `<div class="spinner-border text-warning" role="status">
                <span class="visually-hidden">Loading...</span>
            </div>`


            let url = e.target.dataset.urltipo

            typeRegisters.value = url

            if (typeRegisters.value == "") {
                await GetAllPokeApi(1)
            } else {
                d.getElementById("numberRegisters").style.display = "none"
                //d.getElementById("containerInput").style.display = "none"
                await GetAllPokesByType(url)
            }


            e.target.innerText = nombreTipo

            $('#exampleModal').modal('hide');

            banderaGetAll = true

        } else {
            alert("Servicio en proceso, espere porfavor")
        }

    } 
})







const GetPokeByName = async (namePokemon) => {

    containerCards.innerHTML = `<div class="spinner-border text-warning" role="status">
                                        <span class="visually-hidden">Loading...</span>
                                    </div>`;

    InfoRegistros.textContent = ""


    containerPaginador.innerHTML = ""
    btnPrevious.style.display = "none"
    btnNext.style.display = "none"

    const fdataGBName = new FormData()

    fdataGBName.append("namePokemon", namePokemon)

    let url = "Pokemons/GetByName"

    const responseGetByName = await fetch(url, { method: 'POST', body: fdataGBName })

    if (responseGetByName.status == 200) {

        const pokemonJson = await responseGetByName.json()

            containerCards.innerHTML = "";

        if (pokemonJson.id != 0) {

            const clonetmpCardPokemon = tmptCard.content.cloneNode(true)


            let pokemonName = pokemonJson.name.charAt(0).toUpperCase() + pokemonJson.name.slice(1);

            let color = pokemonJson.types[0].nameType

            clonetmpCardPokemon.querySelector(".namePoke").textContent = pokemonName
            clonetmpCardPokemon.querySelector(".fotoPoke").src = pokemonJson.fotoPokemon
            clonetmpCardPokemon.querySelector(".fotoPoke").alt = pokemonJson.name
            clonetmpCardPokemon.querySelector(".btnPlus").dataset.urlid = pokemonJson.url

            clonetmpCardPokemon.querySelector(".card").style.background = `linear-gradient(180deg, ${colorsByType[color]}, 0) 0%, ${colorsByType[color]}, 0.1612977954853817) 68%, ${colorsByType[color]}, 0.6514938739167542) 100%)`


            clonetmpCardPokemon.querySelector(".btnPlus").addEventListener("click", async (e) => {


                if (banderaGetById) {


                    banderaGetById = false

                    e.target.innerHTML = `<div class="spinner-border text-warning" role="status">
                                      <span class="visually-hidden">Loading...</span>
                                </div>`


                    await GetByIdPokeApi(pokemonJson.id)

                    e.target.innerHTML = "Saber mas"

                    $('#exampleModal').modal('show');

                    banderaGetById = true

                } else {

                    alert("servicio ocupado, espere un momento porfavor")

                }





            })

            containerCards.appendChild(clonetmpCardPokemon)

        } else {


            alert("Pokemon no encontrado!, porfavor verifique su nombre o intente de nuevo mas tarde.")


        }
        
    }

}










