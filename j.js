const express = require('express');
const path = require('path');
const bodParser = require('body-parser');

const User = require('./models/User');

const app = express();

mongoose.connect('mongodb://localhost: 27017/portal_escolar', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

app.get('/register', (req, res) => {
    res.render('register', {mensagemErro: '' });
});

app.post('/register', async (req, res) => {
    const { username, password, tipo } = req.body;

    try {
        const userExists = await User.findOne({ username });
        if (userExists) {
            return res.render('register', {mensagemErro: 'Usuário já existe.'});
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const novoUsuario = new User({ username, password: hashedPassword, tipo });
        await novoUsuario.save();

        res.redirect('/login'); 
    } catch (error) {
        console.error(error);
        res.render('register', { mensaguemErro: 'Erro ao cadastrar. Tente novamente'});
    }
});

app.use(express.static(path.join(_dirname, 'publix')));
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');

app.get('/login', (req, res) => {
    res.render('login', {mensagemErro: '' });
});
app.post('/login', (req, res) => {
    const { username, password } = req.body;
    
    const usuario = await User.findOne({ username });
    if (!usuario) {
        return res.render('login', {mensaguemErro: 'Usuário não encontrado.'});
    }
    const senhaCorreta = await bcrypt.compare(password, usuario.password);
    if (!senhaCorreta) {
        render('login', {mensagemErro: 'Senha incorreta. '});
    }

    res.send(`Login bem-sucedido! Bem-vindo, ${usuario.tipo} ${usuario.username}`);
});
app.get('/', (req, res) => {
    res.redirect('/login');
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});