using back_end.Data;
using back_end.DTO;
using back_end.IServices;
using back_end.Models;
using Microsoft.EntityFrameworkCore;

namespace back_end.Services
{
    public class NoteService : INoteService
    {
        public readonly ApplicationDbContext _noteService;

        public NoteService(ApplicationDbContext noteService)
        {
            _noteService = noteService;
        }
        public async Task<NoteDTO> CreateNoteAsync(string userId, CreateNoteDTO noteDTO)
        {
            var note = new Note
            {
                Title = noteDTO.Title,
                Description = noteDTO.Description,
                UserId = userId,
                CreatedAt = DateTime.UtcNow
            };

            _noteService.Notes.Add(note);
            await _noteService.SaveChangesAsync();

            return new NoteDTO
            {
                Id = note.Id,
                Title = note.Title,
                Description = note.Description,
                CreatedAt = note.CreatedAt
            };
        }
        public async Task<bool> UpdateNoteAsync(string userId, UpdateNoteDTO noteDTO)
        {
            var note = await _noteService
                .Notes
                .FirstOrDefaultAsync(x => x.Id == noteDTO.Id && x.UserId == userId);

            if (note == null) return false;

            note.Title = noteDTO.Title;
            note.Description = noteDTO.Description;

            _noteService.Update(note);
            await _noteService.SaveChangesAsync();

            return true;
        }
        public async Task<bool> DeleteNoteAsync(string userId, int noteId)
        {
            var note = await _noteService
                .Notes
                .FirstOrDefaultAsync(x => x.Id == noteId && x.UserId == userId);

            if (note == null) return false;

            _noteService.Notes.Remove(note);
            await _noteService.SaveChangesAsync();

            return true;
        }

        public async Task<NoteList<NoteDTO>> GetNotesAsync(string userId, int page, int pageSize)
        {
            var notesQuery = _noteService.Notes.AsQueryable();

            var noteCount = await notesQuery.CountAsync();
            var notes = await notesQuery
                .Where(x => x.UserId == userId)
                .OrderByDescending(x => x.CreatedAt)
                .Skip(pageSize * (page - 1))
                .Take(pageSize)
                .Select(x => new NoteDTO
                {
                    Id = x.Id,
                    Title = x.Title,
                    Description = x.Description,
                    CreatedAt = x.CreatedAt
                })
                .ToListAsync();

            return new NoteList<NoteDTO>
            {
                TotalItems = noteCount,
                Page = page,
                PageSize = pageSize,
                PageCount = (int)Math.Ceiling(noteCount / (double)pageSize),
                Notes = notes
            };
        }

        public async Task<NoteList<NoteDTO>> SearchNotesAsync(string userId, string? query, DateTime? fromDate, DateTime? toDate, int page, int pageSize)
        {
            var notesQuery = _noteService.Notes.AsQueryable();

            if (!string.IsNullOrEmpty(query))
            {
                notesQuery = notesQuery.Where(x => x.Title.Contains(query) || x.Description!.Contains(query));
            }

            if (fromDate.HasValue)
            {
                notesQuery = notesQuery.Where(x => x.CreatedAt >= fromDate);
            }
            if (toDate.HasValue)
            {
                notesQuery = notesQuery.Where(x => x.CreatedAt <= toDate);
            }

            var noteCount = await notesQuery.CountAsync();
            var notes = await notesQuery
                .Where(x => x.UserId == userId)
                .OrderByDescending(x => x.CreatedAt)
                .Skip(pageSize * (page - 1))
                .Take(pageSize)
                .Select(x => new NoteDTO
                {
                    Id = x.Id,
                    Title = x.Title,
                    Description = x.Description,
                    CreatedAt = x.CreatedAt
                })
                .ToListAsync();
            
            return new NoteList<NoteDTO>
            {
                TotalItems = noteCount,
                Page = page,
                PageSize = pageSize,
                PageCount = (int)Math.Ceiling(noteCount / (double)pageSize),
                Notes = notes
            };
        }
    }
}