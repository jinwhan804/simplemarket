let posts = {};
let users = {};
let replys = [];
let likeNum = [];
async function GetAPI(){
    try {
        const {data} = await API.get('/post/detail',{
            headers : {
                "Content-Type" : "application/json"
            }
        }) 
        title.value = data.posts.title;
        nickname.value = data.posts.User.nickname;
        contentArea.innerHTML = data.posts.content;
        
        if(data.posts.postLikes != null && data.posts.postLikes != 'null'){
            likeNum = data.posts.postLikes.split(',');
            postLikes.value = likeNum.length;
        }else{
            postLikes.value = 0;
        }            
        
        posts = data.posts;
        users = data.users;

        if(data.users.id != data.posts.userId){
            updateBtn.classList.add('unable');
        }else{
            updateBtn.classList.remove('unable');
        }
        
        await API.post('/reply',{
            headers : {
                "Content-Type" : "application/json"
            },
            data : posts.id
        }).then((e)=>{
            replys = e.data;

            reply_list.innerHTML = "";

            let _li = document.createElement('li');
            let _div1 = document.createElement('div');
            let _div2 = document.createElement('div');
            let _div3 = document.createElement('div');
            let _div4 = document.createElement('div');
            _div1.className = 'reply1';
            _div2.className = 'reply2';
            _div3.className = 'reply3';
            _div4.className = 'reply4';

            _div1.innerHTML = "No.";
            _div2.innerHTML = "내용";
            _div3.innerHTML = "작성자";
            _div4.innerHTML = "시간";
            _li.append(_div1,_div2,_div3,_div4);
            reply_list.append(_li);

            if(e.data == null){
                return;
            }else{
                let date = new Date();
                let year = date.getFullYear();
                let month = date.getMonth() + 1;
                let day = date.getDate();
                let nowdate = year.toString();
                
                if(month >= 10){
                    nowdate += month;
                }else{
                    nowdate += '0' + month;
                }

                if(day >= 10){
                    nowdate += day;
                }else{
                    nowdate += '0' + day;
                }

                nowdate = Number(nowdate);

                e.data.forEach((el,index) => {
                    let updateDate = Number(el.updatedAt.slice(0,10).split('-').join(''));

                    let _li1 = document.createElement('li');
                    let _div5 = document.createElement('div');
                    let _div6 = document.createElement('div');
                    let _div7 = document.createElement('div');
                    let _div8 = document.createElement('div');
                    let btn1 = document.createElement('button');
                    
                    _li1.style.position = 'relative';
                    _li1.className = 'replyLi';
                    _div5.className = 'reply1';
                    _div6.className = 'reply2';
                    _div7.className = 'reply3';
                    _div8.className = 'reply4';

                    _div5.innerHTML = index + 1;
                    _div6.innerHTML = el.content;
                    _div7.innerHTML = el.User.nickname;
                    btn1.innerHTML = "댓글";
                    
                    if(nowdate > updateDate){
                        _div8.innerHTML = el.updatedAt.slice(0,10);
                    }else{
                        _div8.innerHTML = el.updatedAt.slice(11,19);
                    }

                    _li1.append(_div5,_div6,_div7,_div8,btn1);
                    
                    btn1.onclick = ()=>{
                        let rediv = document.createElement('span');
                        let recontentdiv = document.createElement('span');
                        let rerebtn1 = document.createElement('button');
                        let rerebtn2 = document.createElement('button');
                        
                        rediv.className = 'rereply_area';
                        recontentdiv.className = 'rereply_content';
                        recontentdiv.contentEditable = true;

                        rerebtn1.innerHTML = '등록';
                        rerebtn2.innerHTML = '취소';

                        rediv.append(recontentdiv,rerebtn1,rerebtn2);
                        
                        rerebtn1.onclick = async()=>{
                            const form = new FormData();

                            form.append('content',recontentdiv.innerHTML);
                            form.append('userId',users.id);
                            form.append('replyId',el.id);
                            
                            _li1.removeChild(rediv);
                            await API.post('/rereply/insert',form).then((e)=>{
                                location.href = e.data;
                            }).catch((err)=>{
                                console.log(err);
                            })
                        }

                        rerebtn2.onclick = ()=>{
                            _li1.removeChild(rediv);
                        }

                        _li1.append(rediv);
                    }

                    if(users.id == el.User.id){
                        let btn2 = document.createElement('button');
                        let btn3 = document.createElement('button');
                        let btn4 = document.createElement('button');
                        let btn5 = document.createElement('button');

                        btn2.innerHTML = '수정';
                        btn3.innerHTML = '삭제';

                        btn4.innerHTML = '수정';
                        btn5.innerHTML = '취소';

                        
                        btn2.onclick = ()=>{
                            _div6.contentEditable = true;

                            btn2.classList.add('unable');
                            btn3.classList.add('unable');
                            btn4.classList.remove('unable');
                            btn5.classList.remove('unable');
                        }
                        
                        btn3.onclick = async()=>{
                            try {
                                if(confirm('정말 삭제하시겠습니까?')){
                                    await API.post('/reply/delete',{
                                        data : el.id
                                    }).then((e)=>{
                                        location.href = e.data;
                                    }).catch((err)=>{
                                        console.log(err);
                                    })
                                }
                            } catch (error) {
                                console.log(error);
                            }
                        }

                        btn4.onclick = async()=>{
                            _div6.contentEditable = false;

                            btn2.classList.remove('unable');
                            btn3.classList.remove('unable');
                            btn4.classList.add('unable');
                            btn5.classList.add('unable');

                            const form = new FormData();

                            form.append('id', el.id);
                            form.append('content',_div6.innerHTML);

                            await API.post('/reply/update',form).then((e)=>{
                                location.href = e.data;
                            }).catch((err)=>{
                                console.log(err);
                            })
                        }
                        
                        btn5.onclick = ()=>{
                            _div6.contentEditable = false;

                            _div6.innerHTML = el.content;

                            btn2.classList.remove('unable');
                            btn3.classList.remove('unable');
                            btn4.classList.add('unable');
                            btn5.classList.add('unable');
                        }

                        btn4.classList.add('unable');
                        btn5.classList.add('unable');


                        _li1.append(btn2,btn3,btn4,btn5);
                    }

                    reply_list.append(_li1);
                });
            }
        }).catch((err)=>{
            console.log(err);
        })
    } catch (error) {
        console.log(error);
    }
}

// async function RereplyView (){
//     await API.post('/rereply').then((e)=>{
//         if(e.data == null){
//             return;
//         }else{
//             let date = new Date();
//             let year = date.getFullYear();
//             let month = date.getMonth() + 1;
//             let day = date.getDate();
//             let nowdate = year.toString();
            
//             if(month >= 10){
//                 nowdate += month;
//             }else{
//                 nowdate += '0' + month;
//             }

//             if(day >= 10){
//                 nowdate += day;
//             }else{
//                 nowdate += '0' + day;
//             }

//             nowdate = Number(nowdate);

//             replys.forEach((element)=>{
                
//             })
//             e.data.forEach((el,index) => {
//                 let updateDate = Number(el.updatedAt.slice(0,10).split('-').join(''));

//                 let _li2 = document.createElement('li');
//                 let _rediv1 = document.createElement('div');
//                 let _rediv2 = document.createElement('div');
//                 let _rediv3 = document.createElement('div');
//                 let _rediv4 = document.createElement('div');
//                 _li2.className = 'rereplyLine';
//                 _rediv1.className = 'reply1';
//                 _rediv2.className = 'reply2';
//                 _rediv3.className = 'reply3';
//                 _rediv4.className = 'reply4';

//                 _rediv1.innerHTML = index + 1;
//                 _rediv2.innerHTML = el.content;
//                 _rediv3.innerHTML = el.User.nickname;
                
//                 if(nowdate > updateDate){
//                     _rediv4.innerHTML = el.updatedAt.slice(0,10);
//                 }else{
//                     _rediv4.innerHTML = el.updatedAt.slice(11,19);
//                 }

//                 _li2.append(_rediv1,_rediv2,_rediv3,_rediv4);
                
//                 if(users.id == el.User.id){
//                     let rebtn2 = document.createElement('button');
//                     let rebtn3 = document.createElement('button');
//                     let rebtn4 = document.createElement('button');
//                     let rebtn5 = document.createElement('button');

//                     rebtn2.innerHTML = '수정';
//                     rebtn3.innerHTML = '삭제';

//                     rebtn4.innerHTML = '수정';
//                     rebtn5.innerHTML = '취소';

                    
//                     rebtn2.onclick = ()=>{
//                         _rediv2.contentEditable = true;

//                         rebtn2.classList.add('unable');
//                         rebtn3.classList.add('unable');
//                         rebtn4.classList.remove('unable');
//                         rebtn5.classList.remove('unable');
//                     }
                    
//                     rebtn3.onclick = async()=>{
//                         try {
//                             if(confirm('정말 삭제하시겠습니까?')){
//                                 await API.post('/rereply/delete',{
//                                     data : el.id
//                                 }).then((e)=>{
//                                     location.href = e.data;
//                                 }).catch((err)=>{
//                                     console.log(err);
//                                 })
//                             }
//                         } catch (error) {
//                             console.log(error);
//                         }
//                     }

//                     rebtn4.onclick = async()=>{
//                         _rediv2.contentEditable = false;

//                         rebtn2.classList.remove('unable');
//                         rebtn3.classList.remove('unable');
//                         rebtn4.classList.add('unable');
//                         rebtn5.classList.add('unable');

//                         const form = new FormData();

//                         form.append('id', el.id);
//                         form.append('content',_rediv2.innerHTML);

//                         await API.post('/rereply/update',form).then((e)=>{
//                             location.href = e.data;
//                         }).catch((err)=>{
//                             console.log(err);
//                         })
//                     }
                    
//                     rebtn5.onclick = ()=>{
//                         _rediv2.contentEditable = false;

//                         _rediv2.innerHTML = el.content;

//                         rebtn2.classList.remove('unable');
//                         rebtn3.classList.remove('unable');
//                         rebtn4.classList.add('unable');
//                         rebtn5.classList.add('unable');
//                     }

//                     rebtn4.classList.add('unable');
//                     rebtn5.classList.add('unable');


//                     _li2.append(rebtn2,rebtn3,rebtn4,rebtn5);
//                 }

//                 reply_list.append(_li2);
//             });
//         }
//     }).catch((err)=>{
//         console.log(err);
//     })
// }

GetAPI();    

toUpdate.onclick = async()=>{
    try {
        await API.post('/post/updateview',{
            headers : {
                "Content-Type" : "application/json"
            },
            data : posts.id
        }).then((e)=>{
            location.href = e.data;
        }).catch((err)=>{
            console.log(err);
        })
    } catch (error) {
        console.log(error);
    }
}

toDelete.onclick = async()=>{
    try {
        if(confirm('정말 삭제하시겠습니까?')){
            await API.post('/post/delete',{
                headers : {
                    "Content-Type" : "application/json"
                },
                data : posts.id
            }).then((e)=>{
                location.href = e.data;
            }).catch((err)=>{
                console.log(err);
            })
        }
    } catch (error) {
        console.log(error);
    }
}

likeBtn.onclick = async()=>{
    try {
        if(posts.userId != users.id){                
            let likeUser = [];

            if(posts.postLikes == null || posts.postLikes == 'null'){
                posts.postLikes = users.id.toString();
                likeUser.push(posts.postLikes);
            }else{
                likeUser = posts.postLikes.split(",");

                if(!likeUser.includes(users.id.toString())){
                    likeUser.push(users.id.toString());
                    posts.postLikes = likeUser.join(',');                    
                }else{
                    likeUser.splice(likeUser.indexOf(users.id.toString()),1);
                    if(likeUser.length == 0){
                        posts.postLikes = null;
                    }else{
                        posts.postLikes = likeUser.join(',');
                    }
                }
            }

            postLikes.value = likeUser.length;

            const form = new FormData();

            form.append('id',posts.id);
            form.append('postLikes',posts.postLikes);
            
            await API.post('/post/likes',form,{
                headers : {
                    "Content-Type" : "application/json"
                }
            })
        }
    } catch (error) {
        console.log(error);
    }
}

// 댓글 달기
reply_on.onclick = async()=>{
    try {
        const form = new FormData();

        form.append('content', write_reply.innerHTML);
        form.append('userId', users.id);
        form.append('postId', posts.id);

        await API.post('/reply/insert',form).then((e)=>{
            location.href = e.data;
        }).catch((err)=>{
            console.log(err);
        });
    } catch (error) {
        console.log(error);
    }
}

toPost.onclick = ()=>{
    location.href = `./${mainUrl}`;
}