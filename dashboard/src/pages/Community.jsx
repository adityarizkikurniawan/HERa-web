
import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  TextField,
  Button,
  Stack,
  Chip,
  Avatar,
  Alert,
  IconButton,
  MenuItem,
  Divider,
  InputAdornment,
} from "@mui/material";

import {
  Groups,
  Add,
  Favorite,
  FavoriteBorder,
  Chat,
  Delete,
  Search,
  Send,
  Shield,
} from "@mui/icons-material";

const STORAGE_KEY = "hera_demo_community";
const USER_ID_KEY = "hera_demo_community_user";

const categories = [
  "Cerita Harian",
  "Kesehatan & Wellness",
  "Pendidikan",
  "Karier",
  "Pengembangan Diri",
];

const blockedWords = [
  "bodoh",
  "tolol",
  "goblok",
  "bangsat",
  "anjing",
];

function containsBlockedWords(text) {
  return blockedWords.some((word) => {
    const pattern = new RegExp(`\\b${word}\\b`, "i");
    return pattern.test(text);
  });
}

function getUserId() {
  let id = localStorage.getItem(USER_ID_KEY);

  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem(USER_ID_KEY, id);
  }

  return id;
}

function getInitialPosts() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);

    if (saved !== null) {
      const parsed = JSON.parse(saved);
      return Array.isArray(parsed) ? parsed : [];
    }
  } catch {
    // Gunakan data contoh jika data tersimpan tidak valid.
  }

  return [
    {
      id: "demo-1",
      ownerId: "demo",
      category: "Pengembangan Diri",
      content:
        "Halo semuanya! Aku sedang belajar lebih percaya diri saat berbicara di depan umum. Ada tips untuk pemula?",
      createdAt: "2026-10-01T09:00:00",
      likes: [],
      comments: [
        {
          id: "comment-demo-1",
          content:
            "Coba mulai latihan berbicara di depan cermin, lalu perlahan di depan teman.",
          createdAt: "2026-10-01T10:00:00",
        },
      ],
    },
    {
      id: "demo-2",
      ownerId: "demo",
      category: "Cerita Harian",
      content:
        "Hari ini cukup melelahkan, tapi aku bersyukur bisa menyelesaikan beberapa hal kecil. Semangat untuk kita semua! 💜",
      createdAt: "2026-10-02T14:00:00",
      likes: [],
      comments: [],
    },
  ];
}

export default function Community() {
  const [userId] = useState(getUserId);
  const [posts, setPosts] = useState(getInitialPosts);

  const [content, setContent] = useState("");
  const [category, setCategory] = useState("Cerita Harian");
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [message, setMessage] = useState("");
  const [commentInputs, setCommentInputs] = useState({});

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(posts));
  }, [posts]);

  const handleCreatePost = () => {
    const trimmedContent = content.trim();

    if (!trimmedContent) {
      setMessage("Isi postingan tidak boleh kosong.");
      return;
    }

    if (containsBlockedWords(trimmedContent)) {
      setMessage(
        "Postingan mengandung kata yang tidak diperbolehkan. Silakan gunakan bahasa yang lebih baik."
      );
      return;
    }

    const newPost = {
      id: crypto.randomUUID(),
      ownerId: userId,
      category,
      content: trimmedContent,
      createdAt: new Date().toISOString(),
      likes: [],
      comments: [],
    };

    setPosts((prev) => [newPost, ...prev]);
    setContent("");
    setCategory("Cerita Harian");
    setShowForm(false);
    setMessage("");
  };

  const handleLike = (postId) => {
    setPosts((prev) =>
      prev.map((post) => {
        if (post.id !== postId) return post;

        const likes = post.likes || [];
        const liked = likes.includes(userId);

        return {
          ...post,
          likes: liked
            ? likes.filter((id) => id !== userId)
            : [...likes, userId],
        };
      })
    );
  };

  const handleComment = (postId) => {
    const text = (commentInputs[postId] || "").trim();

    if (!text) return;

    if (containsBlockedWords(text)) {
      setMessage(
        "Komentar mengandung kata yang tidak diperbolehkan."
      );
      return;
    }

    const newComment = {
      id: crypto.randomUUID(),
      content: text,
      createdAt: new Date().toISOString(),
    };

    setPosts((prev) =>
      prev.map((post) =>
        post.id === postId
          ? {
              ...post,
              comments: [...(post.comments || []), newComment],
            }
          : post
      )
    );

    setCommentInputs((prev) => ({
      ...prev,
      [postId]: "",
    }));

    setMessage("");
  };

  const handleDelete = (postId) => {
    const post = posts.find((item) => item.id === postId);

    if (!post || post.ownerId !== userId) return;

    if (!window.confirm("Yakin ingin menghapus postingan ini?")) {
      return;
    }

    setPosts((prev) =>
      prev.filter((post) => post.id !== postId)
    );
  };

  const formatDate = (date) =>
    new Date(date).toLocaleString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  const filteredPosts = posts.filter((post) => {
    const keyword = search.toLowerCase();

    return (
      post.content.toLowerCase().includes(keyword) ||
      post.category.toLowerCase().includes(keyword)
    );
  });

  return (
    <Box sx={{ maxWidth: 1000, mx: "auto" }}>
      <Stack
        direction={{ xs: "column", sm: "row" }}
        justifyContent="space-between"
        alignItems={{ xs: "stretch", sm: "center" }}
        spacing={2}
        sx={{ mb: 3 }}
      >
        <Box>
          <Typography variant="h4" fontWeight="bold">
            Safe Space Community 💜
          </Typography>
          <Typography color="text.secondary">
            Ruang berbagi cerita, dukungan, dan pengalaman.
          </Typography>
        </Box>

        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => {
            setShowForm((prev) => !prev);
            setMessage("");
          }}
        >
          Buat Postingan
        </Button>
      </Stack>

      <Alert
        severity="info"
        icon={<Shield />}
        sx={{ mb: 3 }}
      >
        Komunitas ini menggunakan nama anonim. Hindari
        membagikan nama asli, alamat, nomor telepon, atau
        informasi pribadi lainnya.
      </Alert>

      {message && (
        <Alert
          severity="warning"
          onClose={() => setMessage("")}
          sx={{ mb: 2 }}
        >
          {message}
        </Alert>
      )}

      {showForm && (
        <Card sx={{ mb: 3 }}>
          <CardContent sx={{ p: 3 }}>
            <Typography variant="h6" fontWeight="bold" mb={2}>
              Bagikan Ceritamu 🌷
            </Typography>

            <Stack spacing={2}>
              <TextField
                select
                label="Kategori Diskusi"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                fullWidth
              >
                {categories.map((item) => (
                  <MenuItem key={item} value={item}>
                    {item}
                  </MenuItem>
                ))}
              </TextField>

              <TextField
                label="Isi Postingan"
                placeholder="Apa yang ingin kamu bagikan?"
                multiline
                minRows={4}
                fullWidth
                value={content}
                onChange={(e) => setContent(e.target.value)}
                inputProps={{ maxLength: 1000 }}
                helperText={`${content.length}/1000 karakter`}
              />

              <Stack direction="row" spacing={2}>
                <Button
                  variant="contained"
                  onClick={handleCreatePost}
                >
                  Publikasikan
                </Button>

                <Button
                  variant="outlined"
                  onClick={() => setShowForm(false)}
                >
                  Batal
                </Button>
              </Stack>
            </Stack>
          </CardContent>
        </Card>
      )}

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <TextField
            fullWidth
            size="small"
            placeholder="Cari diskusi komunitas..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search />
                </InputAdornment>
              ),
            }}
          />
        </CardContent>
      </Card>

      <Stack spacing={3}>
        {filteredPosts.length === 0 ? (
          <Typography color="text.secondary" textAlign="center">
            Belum ada diskusi yang cocok.
          </Typography>
        ) : (
          filteredPosts.map((post) => {
            const likes = post.likes || [];
            const liked = likes.includes(userId);
            const comments = post.comments || [];

            return (
              <Card key={post.id}>
                <CardContent sx={{ p: 3 }}>
                  <Stack
                    direction="row"
                    alignItems="center"
                    spacing={2}
                    sx={{ mb: 2 }}
                  >
                    <Avatar sx={{ bgcolor: "primary.light" }}>
                      A
                    </Avatar>

                    <Box sx={{ flexGrow: 1 }}>
                      <Typography fontWeight="bold">
                        Anonim
                      </Typography>

                      <Typography
                        variant="caption"
                        color="text.secondary"
                      >
                        {formatDate(post.createdAt)}
                      </Typography>
                    </Box>

                    {post.ownerId === userId && (
                      <IconButton
                        color="error"
                        aria-label="Hapus postingan"
                        onClick={() => handleDelete(post.id)}
                      >
                        <Delete />
                      </IconButton>
                    )}
                  </Stack>

                  <Chip
                    label={post.category}
                    color="primary"
                    variant="outlined"
                    size="small"
                    sx={{ mb: 2 }}
                  />

                  <Typography
                    sx={{
                      whiteSpace: "pre-wrap",
                      overflowWrap: "anywhere",
                      mb: 2,
                    }}
                  >
                    {post.content}
                  </Typography>

                  <Divider sx={{ mb: 2 }} />

                  <Stack
                    direction="row"
                    spacing={3}
                    sx={{ mb: 2 }}
                  >
                    <Button
                      size="small"
                      startIcon={
                        liked ? <Favorite /> : <FavoriteBorder />
                      }
                      onClick={() => handleLike(post.id)}
                    >
                      {likes.length} Dukungan
                    </Button>

                    <Button
                      size="small"
                      startIcon={<Chat />}
                      disabled
                    >
                      {comments.length} Komentar
                    </Button>
                  </Stack>

                  <Stack spacing={2}>
                    {comments.map((comment) => (
                      <Box
                        key={comment.id}
                        sx={{
                          bgcolor: "#FAF8FF",
                          p: 2,
                          borderRadius: 2,
                        }}
                      >
                        <Typography
                          variant="body2"
                          fontWeight="bold"
                        >
                          Anonim
                        </Typography>

                        <Typography
                          variant="body2"
                          sx={{
                            whiteSpace: "pre-wrap",
                            overflowWrap: "anywhere",
                          }}
                        >
                          {comment.content}
                        </Typography>

                        <Typography
                          variant="caption"
                          color="text.secondary"
                        >
                          {formatDate(comment.createdAt)}
                        </Typography>
                      </Box>
                    ))}
                  </Stack>

                  <Stack
                    direction="row"
                    spacing={1}
                    sx={{ mt: 2 }}
                  >
                    <TextField
                      fullWidth
                      size="small"
                      placeholder="Tulis komentar yang suportif..."
                      value={commentInputs[post.id] || ""}
                      onChange={(e) =>
                        setCommentInputs((prev) => ({
                          ...prev,
                          [post.id]: e.target.value,
                        }))
                      }
                      inputProps={{ maxLength: 500 }}
                    />

                    <IconButton
                      color="primary"
                      aria-label="Kirim komentar"
                      onClick={() => handleComment(post.id)}
                    >
                      <Send />
                    </IconButton>
                  </Stack>
                </CardContent>
              </Card>
            );
          })
        )}
      </Stack>
    </Box>
  );
}
