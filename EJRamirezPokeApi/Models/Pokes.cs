using System.ComponentModel.DataAnnotations.Schema;

namespace EJRamirezPokeApi.Models
{
    public class Pokes
    {

        public string? name { get; set; }
        public string? url { get; set; }

        public int id { get; set; }

      

        public string? front_defaultGif { get; set; }
        public string? back_defaultGif { get; set; }

        public string? front_default3D { get; set; }

        public string? front_defaultPng { get; set; }
        public string? back_defaultPng { get; set; }



        public string? fotoPokemon { get; set; }

       


        public List<object>? stats { get; set; }

        public List<object>? types { get; set; }


        public string? typesString { get; set; }

    }
}
