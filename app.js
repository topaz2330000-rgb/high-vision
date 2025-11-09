// Simple YouTube-like static app. Stores video list in localStorage.
node.querySelector('.thumb').style.backgroundImage = `url(https://img.youtube.com/vi/${v.id}/hqdefault.jpg)`;
node.querySelector('.title').textContent = v.title;
card.addEventListener('click', () => openPlayer(v));
grid.appendChild(node);
});
}


function openPlayer(v){
modal.classList.remove('hidden');
playerWrap.innerHTML = `<iframe src="https://www.youtube.com/embed/${v.id}?autoplay=1" allow="autoplay; encrypted-media" allowfullscreen></iframe>`;
modalTitle.textContent = v.title;
modalDesc.textContent = v.description || '';
}


closeModal.addEventListener('click', () => {
modal.classList.add('hidden');
playerWrap.innerHTML='';
});


search.addEventListener('input', e => render(e.target.value));


document.getElementById('addBtn').addEventListener('click', ()=>{
const url = prompt('Paste a YouTube watch URL or share link');
if(!url) return;
const id = parseYouTubeID(url);
if(!id){ alert('Could not detect YouTube ID'); return; }
const title = prompt('Enter a title for this video', 'New video') || 'Untitled';
videos.unshift({id,title});
save();
render();
});


function parseYouTubeID(url){
try{
// handle many YouTube URL formats
const u = new URL(url);
if(u.hostname.includes('youtu.be')) return u.pathname.slice(1);
if(u.searchParams.has('v')) return u.searchParams.get('v');
// embed urls like /embed/ID
const m = u.pathname.match(/embed\/(.+)/);
if(m) return m[1];
return null;
}catch(e){
// fallback: try regex
const m = url.match(/[?&]v=([a-zA-Z0-9_-]{6,})/);
return m ? m[1] : null;
}
}


// init
load();
render();
