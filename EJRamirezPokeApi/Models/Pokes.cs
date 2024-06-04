using System.ComponentModel.DataAnnotations.Schema;

namespace EJRamirezPokeApi.Models
{
    public class Pokes
    {

        public string? name { get; set; }
        public string? url { get; set; }

        public int id { get; set; }

        [NotMapped]
        public string? fotoPokemon { get; set; }

        public List<object>? stats { get; set; }

        public List<object>? types { get; set; }


        public string? typesString { get; set; }

    }
}
