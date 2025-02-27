let paginaAtual = 1;
const itemsPorPagina = 10;

function atualizarTabela(fotos) {
    let corpoPagina = document.getElementById('photoTable');
    corpoPagina.innerHTML = '';

    let inicio = (paginaAtual - 1) * itemsPorPagina;
    let fim = inicio + itemsPorPagina;
    let fotosPaginadas = fotos.slice(inicio, fim);

    fotosPaginadas.forEach(foto => {
        let row = `<tr>
            <td>${foto.albumId}</td>
            <td>${foto.id}</td>
            <td>${foto.title}</td>
            <td><img src="${foto.url}" width="50"></td>
            <td><img src="${foto.thumbnailUrl}" width="50"></td>
        </tr>`;
        corpoPagina.innerHTML += row;
    });

    document.getElementById('numeroPagina').innerText = paginaAtual;
}

document.getElementById('formFotos').addEventListener('submit', function(event) {
    event.preventDefault();
    let albumId = parseInt(document.getElementById('albumId').value);
    let title = document.getElementById('title').value;
    let url = document.getElementById('url').value;
    let thumbnailUrl = document.getElementById('thumbnailUrl').value;
    let fotos = JSON.parse(localStorage.getItem('photos')) || [];

    let novoId = fotos.length > 0 ? Math.max(...fotos.map(f => f.id)) + 1 : 1;
    let novaFoto = { albumId, id: novoId, title, url, thumbnailUrl };

    fotos.push(novaFoto);
    localStorage.setItem('photos', JSON.stringify(fotos));
    adicionarFotoAPI(novaFoto);
    alert('Foto adicionada com sucesso!');
    document.getElementById('formFotos').reset();
});

function editarFoto() {
    let id = parseInt(document.getElementById('editarId').value);
    let title = document.getElementById('editarTitle').value;
    let url = document.getElementById('editarUrl').value;
    let thumbnailUrl = document.getElementById('editarThumbnailUrl').value;

    if (isNaN(id) || id <= 0) {
        alert('ID inválido!');
        return;
    }

    let fotos = JSON.parse(localStorage.getItem('photos')) || [];
    let fotoIndex = fotos.findIndex(foto => foto.id === id);

    if (fotoIndex > 0) {
        fotos[fotoIndex] = { id, albumId: fotos[fotoIndex].albumId, title, url, thumbnailUrl };
        localStorage.setItem('photos', JSON.stringify(fotos));
        editarFotoAPI(fotos[fotoIndex]);
        alert('Foto editada com sucesso!');

        document.getElementById('editarId').value = '';
        document.getElementById('editarTitle').value = '';
        document.getElementById('editarUrl').value = '';
        document.getElementById('editarThumbnailUrl').value = '';

        carregarFotos();
    } else {
        alert('Foto não encontrada!');
    }
}

document.getElementById('editarId').addEventListener('input', function(event) {
    let id = parseInt(event.target.value);
    if (id) {
        let fotos = JSON.parse(localStorage.getItem('photos')) || [];
        let foto = fotos.find(f => f.id === id);

        if (foto) {
            document.getElementById('editarTitle').value = foto.title;
            document.getElementById('editarUrl').value = foto.url;
            document.getElementById('editarThumbnailUrl').value = foto.thumbnailUrl;
        } else {
            document.getElementById('editarTitle').value = '';
            document.getElementById('editarUrl').value = '';
            document.getElementById('editarThumbnailUrl').value = '';
        }
    }
});

function excluirFoto() {
    let id = parseInt(document.getElementById('excluirId').value);
    let fotos = JSON.parse(localStorage.getItem('photos')) || [];
    let fotosFiltrada = fotos.filter(foto => foto.id !== id);
    localStorage.setItem('photos', JSON.stringify(fotosFiltrada));
    excluirFotoAPI(id);
    alert('Foto excluída!');
    document.getElementById('excluirId').value = '';
    carregarFotos();
}

function trocarPagina(direcao) {
    let fotos = JSON.parse(localStorage.getItem('photos')) || [];
    let paginasTotais = Math.ceil(fotos.length / itemsPorPagina);
    if (paginaAtual + direcao > 0 && paginaAtual + direcao <= paginasTotais) {
        paginaAtual += direcao;
        carregarFotos();
    }
}

function pesquisarFotos() {
    let termo = document.getElementById('campoPesquisa').value.toLowerCase();
    let fotos = JSON.parse(localStorage.getItem('photos')) || [];

    let fotosFiltradas = fotos.filter(foto => 
        foto.id.toString().includes(termo) || 
        foto.title.toLowerCase().includes(termo)
    );

    atualizarTabela(fotosFiltradas);
}

function mostrarSecoes(section) {
    document.getElementById('cadastrar').classList.add('d-none');
    document.getElementById('listar').classList.add('d-none');
    document.getElementById('delete').classList.add('d-none');
    document.getElementById('editar').classList.add('d-none');

    document.getElementById(section).classList.remove('d-none');

    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.classList.remove('active-section');
    });

    const activeLink = Array.from(navLinks).find(link => link.getAttribute('onclick').includes(section));
    if (activeLink) {
        activeLink.classList.add('active-section');
    }

    if (section === 'listar') carregarFotos();
}

function carregarFotos() {
    let fotos = JSON.parse(localStorage.getItem('photos')) || [];
    fotos.reverse();
    atualizarTabela(fotos);
}