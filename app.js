
// Simple voucher app with Firebase (compat build for simplicity)
// Editor modal (create/edit/view)
function openEditor(v){
// Build modal content (simple form)
editorModal.classList.remove('hidden');
editorModal.innerHTML = `<div class="modal content card">
<button id="closeEditor">Close</button>
<h3>Voucher ${v ? v.voucherId || '' : ''}</h3>
<input id="clientName" placeholder="Client Name" value="${v ? v.clientName : ''}" />
<input id="project" placeholder="Project" value="${v ? v.project : ''}" />
<input id="amount" placeholder="Amount" value="${v ? v.amount : ''}" />
<textarea id="notes" placeholder="Notes">${v ? (v.notes || '') : ''}</textarea>
<div>
<button id="saveBtn">Save</button>
<button id="markPaid">Mark as Paid</button>
<button id="shareBtn">Share Link</button>
<button id="pdfBtn">Export PDF</button>
</div>
<div id="stampWrap"></div>
</div>`;


document.getElementById('closeEditor').addEventListener('click', ()=>editorModal.classList.add('hidden'));
document.getElementById('saveBtn').addEventListener('click', async ()=>{
const payload = {
clientName: document.getElementById('clientName').value,
project: document.getElementById('project').value,
amount: Number(document.getElementById('amount').value || 0),
notes: document.getElementById('notes').value,
status: v && v.status ? v.status : 'unpaid',
company: 'High Vision',
date: new Date().toISOString()
};
if(v && v.id){
await db.collection('vouchers').doc(v.id).set(payload, {merge:true});
alert('Saved');
}else{
const doc = await db.collection('vouchers').add(payload);
await doc.update({voucherId: `HV-${doc.id.slice(0,6).toUpperCase()}`});
alert('Created');
}
editorModal.classList.add('hidden');
});


document.getElementById('markPaid').addEventListener('click', async ()=>{
if(!v || !v.id) return alert('Save voucher first');
await db.collection('vouchers').doc(v.id).update({status:'paid', paidAt: new Date().toISOString()});
showStamp();
});


document.getElementById('shareBtn').addEventListener('click', async ()=>{
// create short token doc
const tokenRef = await db.collection('public_tokens').add({voucherId: v.id, createdAt: new Date().toISOString()});
const url = `${location.origin}${location.pathname}?token=${tokenRef.id}`;
prompt('Share this link (view-only):', url);
});


document.getElementById('pdfBtn').addEventListener('click', ()=>exportPDF(v));
}


function showStamp(){
const wrap = document.getElementById('stampWrap');
wrap.innerHTML = '<div class="stamp">PAID</div>';
// simple animation
const stamp = wrap.querySelector('.stamp');
stamp.animate([{transform:'translateY(-60px) rotate(-30deg)', opacity:0},{transform:'translateY(0) rotate(-20deg)', opacity:1}],{duration:700,easing:'cubic-bezier(.2,.9,.3,1)'});
// confetti suggestion (could implement third-party confetti lib)
}
