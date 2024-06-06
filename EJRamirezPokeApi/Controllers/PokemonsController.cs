using EJRamirezPokeApi.Models;
using Microsoft.AspNetCore.DataProtection.KeyManagement;
using Microsoft.AspNetCore.Mvc;
using Microsoft.DotNet.Scaffolding.Shared.CodeModifier.CodeChange;
using Newtonsoft.Json;
using NuGet.Common;
using NuGet.Protocol;
using System.Security.Policy;
using static System.Net.WebRequestMethods;

namespace EJRamirezPokeApi.Controllers
{
    public class PokemonsController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }

        public async Task<JsonResult> GetAll(int numRegisters, int pagina)
        {

            Response? pokes = new Response();

            int nReg = numRegisters <= 0 ? 10 : numRegisters;
            int inicio;

            if (pagina <= 0)
            {
                inicio = 0;
                pagina = 1;
            }
            else
            {
                inicio = (pagina - 1) * nReg;
            }


            string limit = $"&limit={nReg}";

            string offset = $"?offset={inicio}";


            string url = $"https://pokeapi.co/api/v2/pokemon{offset + limit}";


            using (HttpClient client = new HttpClient())
            {

                var responseApi = await client.GetAsync(url);


                var resultServicio = responseApi.Content;

                if (responseApi.IsSuccessStatusCode)
                {

                    var responsePokemons = await resultServicio.ReadAsStringAsync();


                    pokes = JsonConvert.DeserializeObject<Response>(responsePokemons);

                    pokes.urlActual = url;

                    for (int i = 0; i < pokes.results.Count; i++)
                    {

                        var responsePokeGetById = await client.GetAsync(pokes.results[i].url);


                        var resultPokeInfo = responsePokeGetById.Content;


                        if (responsePokeGetById.IsSuccessStatusCode)
                        {
                            var responsePoke = await resultPokeInfo.ReadAsStringAsync();


                            dynamic? pokeInfo = JsonConvert.DeserializeObject<dynamic>(responsePoke);

                            pokes.results[i].fotoPokemon = pokeInfo["sprites"]["other"]["official-artwork"]["front_default"].Value;

                            pokes.results[i].id = pokeInfo["id"];

                            pokes.results[i].typesString = pokeInfo["types"][0]["type"]["name"];

                            pokes.results[i].types = new List<object>();

                            foreach (dynamic t in pokeInfo["types"])
                            {
                                Types type = new Types();

                                type.nameType = t["type"]["name"];
                                type.url = t["type"]["url"];

                                pokes.results[i].types.Add(type);

                            }


                        }
                    }
                }

            }

            pokes.totalPaginas = Math.Ceiling(Convert.ToDecimal(pokes.count / nReg));

            return Json(pokes);
        }






        public async Task<JsonResult> GetById(int idPokemon)
        {

            Pokes? poke = new Pokes();


            string url = $"https://pokeapi.co/api/v2/pokemon/{idPokemon}";


            using (HttpClient client = new HttpClient())
            {

                var responseApi = await client.GetAsync(url);


                var resultServicio = responseApi.Content;

                if (responseApi.IsSuccessStatusCode)
                {

                    var responsePokemon = await resultServicio.ReadAsStringAsync();


                    dynamic? pokemonResult = JsonConvert.DeserializeObject<dynamic>(responsePokemon);

                    poke.name = pokemonResult["name"];

                    poke.fotoPokemon = pokemonResult["sprites"]["other"]["official-artwork"]["front_default"].Value;

                    poke.id = pokemonResult["id"];

                    poke.stats = new List<object>();

                    poke.types = new List<object>();

                    foreach (dynamic st in pokemonResult["stats"])
                    {
                        Stats stats = new Stats();

                        stats.base_stat = st["base_stat"];
                        stats.nameStat = st["stat"]["name"];

                        poke.stats.Add(stats);

                    }

                    poke.typesString = string.Empty;

                    foreach (dynamic tp in pokemonResult["types"])
                    {
                        Types types = new Types();

                        types.nameType = tp["type"]["name"];
                        types.url = tp["type"]["url"];

                        types.nameType = char.ToUpper(types.nameType[0]) + types.nameType.Substring(1);
                        
                        poke.typesString += $"{types.nameType}, ";


                        poke.types.Add(types);

                    }

                    poke.typesString = poke.typesString[..^2];


                }

            }


            return Json(poke);

        }




        public async Task<JsonResult> GetByName(string namePokemon)
        {

            Pokes? poke = new Pokes();


            string url = $"https://pokeapi.co/api/v2/pokemon/{namePokemon}";

        
            using (HttpClient client = new HttpClient())
            {

                var responseApiPokemonByName = await client.GetAsync(url);


                var resultServicioApiPokemonByName = responseApiPokemonByName.Content;

                if (responseApiPokemonByName.IsSuccessStatusCode)
                {

                    var responsePokemonByName = await resultServicioApiPokemonByName.ReadAsStringAsync();


                    dynamic? pokemonResponse = JsonConvert.DeserializeObject<dynamic>(responsePokemonByName);

                    poke.name = pokemonResponse["name"];

                    poke.fotoPokemon = pokemonResponse["sprites"]["other"]["official-artwork"]["front_default"].Value;

                    poke.id = pokemonResponse["id"];


                    poke.types = new List<object>();

                    foreach (dynamic t in pokemonResponse["types"])
                    {
                        Types type = new Types();

                        type.nameType = t["type"]["name"];
                        type.url = t["type"]["url"];

                        poke.types.Add(type);

                    }

                }

            }


            return Json(poke);

        }




        public async Task<JsonResult> TypesGetAll()
        {
            Response? response = new Response();

            string urlTypes = "https://pokeapi.co/api/v2/type?offset=0&limit=21";

            using (HttpClient client = new HttpClient())
            {
                var responseTypes = await client.GetAsync(urlTypes);


                var resultServicioTypes = responseTypes.Content;

                if (responseTypes.IsSuccessStatusCode)
                {
                    var responseReadTypes = await resultServicioTypes.ReadAsStringAsync();


                    response = JsonConvert.DeserializeObject<Response>(responseReadTypes);
                }

                return Json(response);
            }




        }



        public async Task<JsonResult> GetAllByType(string? url)
        {
            Response? response = new Response();

            string urlPokesByType = url;

            using (HttpClient client = new HttpClient())
            {
                var responsePokesByType = await client.GetAsync(urlPokesByType);


                var resultServicioPokesByType = responsePokesByType.Content;

                if (responsePokesByType.IsSuccessStatusCode)
                {
                    var responseReadPokesByType = await resultServicioPokesByType.ReadAsStringAsync();


                    dynamic? resPokesByTypesDeserialize = JsonConvert.DeserializeObject<dynamic>(responseReadPokesByType);

                    response.pokemontype = resPokesByTypesDeserialize["name"];

                    response.results = new List<Pokes>();

                    foreach (dynamic pokemon in resPokesByTypesDeserialize["pokemon"])
                    {
                        var responsePoke = await client.GetAsync(pokemon["pokemon"]["url"].Value);


                        var resultServicioPoke = responsePoke.Content;

                        if (responsePoke.IsSuccessStatusCode)
                        {

                            var responseReadPoke = await resultServicioPoke.ReadAsStringAsync();


                            dynamic? resPokeDeserialize = JsonConvert.DeserializeObject<dynamic>(responseReadPoke);


                            Pokes poke = new Pokes();


                            poke.name = resPokeDeserialize["name"];

                            poke.fotoPokemon = resPokeDeserialize["sprites"]["other"]["official-artwork"]["front_default"].Value;


                            poke.id = resPokeDeserialize["id"];

                            poke.typesString = resPokeDeserialize["types"][0]["type"]["name"];


                            poke.types = new List<object>();

                            foreach (dynamic t in resPokeDeserialize["types"])
                            {
                                Types type = new Types();

                                type.nameType = t["type"]["name"];
                                type.url = t["type"]["url"];

                                poke.types.Add(type);

                            }



                            response.results.Add(poke);

                        }
                    }

                }

                return Json(response);
            }




        }





    }
}
