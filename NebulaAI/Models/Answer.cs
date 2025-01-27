using System.Text.Json.Serialization;

namespace NebulaAI.Models
{
    public class Answer
    {
        [JsonPropertyName("text")]
        public string Text { get; set; } = string.Empty;

        [JsonPropertyName("finish_reason")]
        public string FinishReason { get; set; } = string.Empty;
    }
}
