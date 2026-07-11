import { Router } from "express";
import { getAllBlogs, getAllComments } from "../models/blog.js";

const router = Router();

const showBlog = async (req, res) => {
    if (!req.session.user) {
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

    res.render('blog', { title: 'Blog', posts, editId: null });
};

router.get('/', showBlog);

export default router;
