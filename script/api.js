const URL = 'https://jsonplaceholder.typicode.com/photos'

function getFotos() {
    fetch(URL)
        .then(response => response.json())
        .then(data => {
            let fotos = JSON.parse(localStorage.getItem('photos')) || [];
            let novasFotos = data.filter(foto => !fotos.some(f => f.id === fotos.id));

            if (novasFotos.length) {
                localStorage.setItem('photos', JSON.stringify([...fotos, ...novasFotos]));
                alert(`${novasFotos.length} novas fotos adicionadas!`);
            } else {
                alert('Nenhuma nova foto encontrada.');
            }
            carregarFotos();
        })
        .catch(console.error);
}

function adicionarFotoAPI(foto) {
    fetch(URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(foto)
    })
    .then(response => response.json())
    .then(data => {
        alert('Foto cadastrada com sucesso na API!');
    })
    .catch(error => {
        console.error('Erro ao adicionar foto:', error);
    });
}

function editarFotoAPI(foto) {
    fetch(`${URL}/${foto.id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(foto)
    })
    .then(response => response.json())
    .then(data => {
        alert('Foto editada com sucesso na API!');
    })
    .catch(error => {
        console.error('Erro ao editar foto na API:', error);
    });
}

function excluirFotoAPI(id) {
    fetch(`${URL}/${id}`, {
        method: 'DELETE',
    })
    .then(response => {
        if (response.ok) {
            alert('Foto excluída com sucesso na API!');
        } else {
            alert('Erro ao excluir foto na API!');
        }
    })
    .catch(error => {
        console.error('Erro ao excluir foto na API: ', error);
    });
}