import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Cloudflare R2 Upload Helper Mock
export const uploadMediaToR2 = async (fileBuffer: string, fileName: string): Promise<string> => {
  // Simulates Cloudflare R2 bucket storage URL output
  const cleanName = fileName.replace(/[^a-zA-Z0-9.-]/g, '_');
  return `https://r2.vibeconnect.app/media/posts/${Date.now()}_${cleanName}`;
};

// GET /api/feed?type=following|nearby|trending
export const getFeed = async (req: Request, res: Response): Promise<void> => {
  try {
    const currentUserId = (req as any).user?.id || 'demo-user-id';
    const feedType = (req.query.type as string) || 'trending';

    const posts = await prisma.post.findMany({
      include: {
        user: { select: { id: true, name: true, photoUrl: true, city: true } },
        community: { select: { id: true, name: true } },
        likes: { where: { userId: currentUserId } },
        saves: { where: { userId: currentUserId } },
        comments: {
          include: { user: { select: { name: true, photoUrl: true } } },
          orderBy: { createdAt: 'desc' },
          take: 3,
        },
      },
      orderBy:
        feedType === 'trending'
          ? { likesCount: 'desc' }
          : { createdAt: 'desc' },
      take: 20,
    });

    const formatted = posts.map((p) => ({
      id: p.id,
      content: p.content,
      photoUrl: p.photoUrl,
      locationName: p.locationName,
      likesCount: p.likesCount,
      commentsCount: p.commentsCount,
      isLiked: p.likes.length > 0,
      isSaved: p.saves.length > 0,
      createdAt: p.createdAt,
      author: p.user,
      communityName: p.community?.name,
      recentComments: p.comments,
    }));

    res.json({
      success: true,
      feedType,
      posts: formatted,
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to fetch social feed' });
  }
};

// POST /api/feed/create
export const createPost = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user?.id || 'demo-user-id';
    const { content, photoUrl, locationName, communityId } = req.body;

    if (!content && !photoUrl) {
      res.status(400).json({ error: 'Post content or photo is required' });
      return;
    }

    let finalPhotoUrl = photoUrl;
    if (photoUrl && photoUrl.startsWith('data:image')) {
      finalPhotoUrl = await uploadMediaToR2(photoUrl, 'uploaded_post.png');
    }

    const post = await prisma.post.create({
      data: {
        userId,
        content,
        photoUrl: finalPhotoUrl,
        locationName: locationName || 'Chennai',
        communityId,
      },
      include: {
        user: { select: { id: true, name: true, photoUrl: true, city: true } },
      },
    });

    res.json({
      success: true,
      message: 'Post created successfully!',
      post,
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to create post' });
  }
};

// POST /api/feed/like
export const toggleLike = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user?.id || 'demo-user-id';
    const { postId } = req.body;

    const existing = await prisma.postLike.findUnique({
      where: { postId_userId: { postId, userId } },
    });

    if (existing) {
      await prisma.postLike.delete({ where: { id: existing.id } });
      await prisma.post.update({
        where: { id: postId },
        data: { likesCount: { decrement: 1 } },
      });
      res.json({ success: true, liked: false });
    } else {
      await prisma.postLike.create({ data: { postId, userId } });
      await prisma.post.update({
        where: { id: postId },
        data: { likesCount: { increment: 1 } },
      });
      res.json({ success: true, liked: true });
    }
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to toggle like' });
  }
};

// POST /api/feed/comment
export const commentPost = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user?.id || 'demo-user-id';
    const { postId, content } = req.body;

    if (!content) {
      res.status(400).json({ error: 'Comment content cannot be empty' });
      return;
    }

    const comment = await prisma.postComment.create({
      data: { postId, userId, content },
      include: { user: { select: { name: true, photoUrl: true } } },
    });

    await prisma.post.update({
      where: { id: postId },
      data: { commentsCount: { increment: 1 } },
    });

    res.json({
      success: true,
      comment,
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to add comment' });
  }
};

// POST /api/feed/save
export const toggleSavePost = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user?.id || 'demo-user-id';
    const { postId } = req.body;

    const existing = await prisma.postSave.findUnique({
      where: { postId_userId: { postId, userId } },
    });

    if (existing) {
      await prisma.postSave.delete({ where: { id: existing.id } });
      res.json({ success: true, saved: false });
    } else {
      await prisma.postSave.create({ data: { postId, userId } });
      res.json({ success: true, saved: true });
    }
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to save post' });
  }
};

// DELETE /api/feed/post/:postId
export const deletePost = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user?.id || 'demo-user-id';
    const { postId } = req.params;

    const post = await prisma.post.findUnique({ where: { id: postId } });
    if (!post) {
      res.status(404).json({ error: 'Post not found' });
      return;
    }

    if (post.userId !== userId) {
      res.status(403).json({ error: 'Unauthorized to delete this post' });
      return;
    }

    await prisma.post.delete({ where: { id: postId } });
    res.json({ success: true, message: 'Post deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to delete post' });
  }
};

export const FeedController = {
  getPosts: getFeed,
  createPost,
  toggleLike,
  commentPost,
  toggleSavePost,
  deletePost,
};
