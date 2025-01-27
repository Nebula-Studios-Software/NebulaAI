using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace NebulaAI.Models
{
    public class AnswerResponse
    {
        [JsonPropertyName("results")]
        public List<Answer> Results { get; set; } = new List<Answer>();
    }
}
