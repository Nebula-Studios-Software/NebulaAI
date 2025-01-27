using System.Text.Json.Serialization;

namespace NebulaAI.Models;

public class Question
{
    [JsonPropertyName("max_context_length")]
    public int MaxContextLength { get; set; }
    [JsonPropertyName("max_lenght")]
    public int MaxLenght { get; set; }
    [JsonPropertyName("prompt")]
    public string Prompt { get; set; } = string.Empty;
    [JsonPropertyName("quiet")]
    public bool Quiet { get; set; }
}
