using System.ComponentModel.DataAnnotations.Schema;

namespace EJRamirezPokeApi.Models
{
    public class Response
    {

        public int count { get; set; }
        public string next { get; set; }
        public object previous { get; set; }
        public List<Pokes> results { get; set; }

        [NotMapped]
        public string? urlActual { get; set; }


        public decimal totalPaginas { get; set; }


        public string? pokemontype { get; set; }




    }
}
