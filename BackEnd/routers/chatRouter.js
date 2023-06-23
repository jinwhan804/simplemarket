const router = require('express').Router();
const { ChatInsert, ViewAllChats, viewOneChat } = require('../controllers/chatController');
const { isLogin } = require('../middleware/loginmiddleware');

router.post('/chat_insert', isLogin, ChatInsert);

router.get('/all_chats', ViewAllChats);

router.post('/:nickname', isLogin, viewOneChat);

module.exports = router;