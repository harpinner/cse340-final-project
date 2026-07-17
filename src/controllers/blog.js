import { Router } from "express";
import { getAllBlogs, getAllComments, createComment, deleteComment, updateComment, createBlog, updateBlog, deleteBlog } from "../models/blog.js";
const router = Router();
const isStaff = (req) => ['admin', 'employee'].includes(req.session?.user?.role);

const showBlog = async (req, res) => {
    if (!isStaff(req)) {
        res.flash('error', 'You must be logged in as an admin or employee to view the blog.');
        return res.redirect('/accounts/login');
    }

    const blogRows = await getAllBlogs();
    const posts = await Promise.all(blogRows.map(async (post) => ({
        ...post,
        date: post.created_at,
        author_name: post.author,
        comments: (await getAllComments(post.id)).map((comment) => ({
            ...comment,
            commenter_id: comment.user_id,
            commenter_name: comment.user,
            comment_text: comment.comment,
            date: comment.created_at
        }))
    })));

    res.render('blog', { title: 'Blog', posts, editId: req.query.editId ?? null, blogEditId: req.query.blogEditId ?? null });
};

const postComment = async (req, res) => {
    if (!isStaff(req)) {
        res.flash('error', 'You must be logged in as an admin or employee to create a comment.');
        return res.redirect('/accounts/login');
    }

    const postId = req.params.postId ?? req.body.post_id;
    const { comment: commentText } = req.body;
    const userId = req.session.user.id;

    if (!postId) {
        res.flash('error', 'Unable to determine which post to comment on.');
        return res.redirect('/blog');
    }
    
    await createComment(postId, userId, commentText);
    res.redirect('/blog');
};

const changeComment = async (req, res) => {
    if (!isStaff(req)) {
        res.flash('error', 'You must be logged in as an admin or employee to edit a comment.');
        return res.redirect('/accounts/login');
    }

    const { comment_id: commentId, comment_text: newCommentText } = req.body;
    await updateComment(commentId, newCommentText);
    res.redirect('/blog');
};

const editComment = async (req, res) => {
    if (!isStaff(req)) {
        res.flash('error', 'You must be logged in as an admin or employee to edit a comment.');
        return res.redirect('/accounts/login');
    }

    const { commentId } = req.params;
    res.redirect(`/blog?editId=${encodeURIComponent(commentId)}`);
}

const removeComment = async (req, res) => {
    if (!isStaff(req)) {
        res.flash('error', 'You must be logged in as an admin or employee to delete a comment.');
        return res.redirect('/accounts/login');
    }

    const { comment_id: commentId } = req.body;
    await deleteComment(commentId);
    res.redirect('/blog');
};

const createNewBlogPost = async (req, res) => {
    if (!isStaff(req)) {
        res.flash('error', 'You must be logged in as an admin or employee to create a blog post.');
        return res.redirect('/accounts/login');
    }

    const { title, content } = req.body;
    const authorId = req.session.user.id;

    await createBlog(title, content, authorId);
    res.redirect('/blog');
};

const updateExistingBlogPost = async (req, res) => {
    if (!isStaff(req)) {
        res.flash('error', 'You must be logged in as an admin or employee to update a blog post.');
        return res.redirect('/accounts/login');
    }
    
    const { postId, title, content } = req.body;
    await updateBlog(postId, title, content);
    res.redirect('/blog');
}

const deleteExistingBlogPost = async (req, res) => {
    if (!isStaff(req)) {
        res.flash('error', 'You must be logged in as an admin or employee to delete a blog post.');
        return res.redirect('/accounts/login');
    }

    const { postId } = req.body;
    await deleteBlog(postId);
    res.redirect('/blog');
};

const editBlogPost = async (req, res) => {
    if (!isStaff(req)) {
        res.flash('error', 'You must be logged in as an admin or employee to edit a blog post.');
        return res.redirect('/accounts/login');
    }

    const { postId } = req.params;
    res.redirect(`/blog?blogEditId=${encodeURIComponent(postId)}`);
};

router.get('/edit/:postId', editBlogPost);

router.get('/', showBlog);
router.post('/comments/:postId', postComment);
router.post('/comments', postComment);
router.put('/comments', changeComment);
router.delete('/comments', removeComment);
router.get('/comments/:commentId/edit', editComment);
router.post('/create', createNewBlogPost);
router.put('/update', updateExistingBlogPost);
router.delete('/delete', deleteExistingBlogPost);

export default router;
