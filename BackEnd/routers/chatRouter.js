const router = require('express').Router();
const { ChatInsert, ViewAllChats } = require('../controllers/chatController');
const { isLogin } = require('../middleware/loginmiddleware');

router.post('/chat_insert', isLogin, ChatInsert);

router.get('/all_chats', ViewAllChats);

module.exports = router;