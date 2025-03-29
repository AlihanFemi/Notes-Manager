namespace back_end.DTO
{
    public class NoteDTO
    {
        public int Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string? Description { get; set; }
    }
    public class CreateNoteDTO
    {
        public string Title { get; set; } = string.Empty;
        public string? Description { get; set; }
    }
    public class UpdateNoteDTO
    {
        public int Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string? Description { get; set; }
    }
}
