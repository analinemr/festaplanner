package com.festaplanner.config;

import com.festaplanner.model.*;
import com.festaplanner.repository.ProdutoRepository;
import com.festaplanner.repository.TemaRepository;
import com.festaplanner.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;

/**
 * Popula o banco com dados de exemplo ao subir a aplicação: usuários de teste
 * e o catálogo completo (temas + produtos), trazido do protótipo Angular
 * (orcamento-component.ts) para o banco de dados real.
 *
 * Remova ou proteja por profile (ex.: @Profile("dev")) antes de ir para produção.
 */
@Component
@RequiredArgsConstructor
public class DataSeeder implements CommandLineRunner {

    private final UsuarioRepository usuarioRepository;
    private final ProdutoRepository produtoRepository;
    private final TemaRepository temaRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        if (usuarioRepository.count() > 0) return;

        usuarioRepository.save(Usuario.builder()
                .nome("Ana Aline")
                .email("admin@festaplanner.com")
                .senhaHash(passwordEncoder.encode("admin123"))
                .perfil(Perfil.ADMINISTRADOR)
                .provedorLogin(ProvedorLogin.EMAIL)
                .emailVerificado(true)
                .build());

        usuarioRepository.save(Usuario.builder()
                .nome("Cliente Teste")
                .email("cliente@teste.com")
                .senhaHash(passwordEncoder.encode("cliente123"))
                .perfil(Perfil.CLIENTE)
                .provedorLogin(ProvedorLogin.EMAIL)
                .emailVerificado(true)
                .build());

// ---- Temas Infantis ----

Tema temaInf0 = temaRepository.save(Tema.builder()
    .nome("Super Heróis")
    .descricao("Painel, mesa decorada e visual vibrante inspirado em heróis.")
    .tipoEvento(TipoEvento.INFANTIL)
    .valor(new BigDecimal("1200"))
    .genero(Genero.MENINO)
    .imagemUrl("assets/orcamento/temas/infantil/super-herois.jpg")
    .build());

Tema temaInf1 = temaRepository.save(Tema.builder()
    .nome("Dinossauro")
    .descricao("Tema aventureiro com folhagens, painel e mesa decorada.")
    .tipoEvento(TipoEvento.INFANTIL)
    .valor(new BigDecimal("1250"))
    .genero(Genero.MENINO)
    .imagemUrl("assets/orcamento/temas/infantil/dinossauro.jpg")
    .build());

Tema temaInf2 = temaRepository.save(Tema.builder()
    .nome("Futebol e Times do Coração")
    .descricao("Decoração esportiva com painel e composição inspirada em futebol.")
    .tipoEvento(TipoEvento.INFANTIL)
    .valor(new BigDecimal("1100"))
    .genero(Genero.MENINO)
    .imagemUrl("assets/orcamento/temas/infantil/futebol.jpg")
    .build());

Tema temaInf3 = temaRepository.save(Tema.builder()
    .nome("Veículos Hot Wheels")
    .descricao("Tema infantil com carros, pistas, velocidade e decoração inspirada no universo Hot Wheels.")
    .tipoEvento(TipoEvento.INFANTIL)
    .valor(new BigDecimal("1300"))
    .genero(Genero.MENINO)
    .imagemUrl("assets/orcamento/temas/infantil/hot-wheels.jpg")
    .build());

Tema temaInf4 = temaRepository.save(Tema.builder()
    .nome("Video Game / Universo Game")
    .descricao("Tema infantil gamer com controles, personagens, luzes e decoração inspirada no universo dos games.")
    .tipoEvento(TipoEvento.INFANTIL)
    .valor(new BigDecimal("1350"))
    .genero(Genero.MENINO)
    .imagemUrl("assets/orcamento/temas/infantil/video-game.jpg")
    .build());

Tema temaInf5 = temaRepository.save(Tema.builder()
    .nome("Princesas da Disney")
    .descricao("Tema delicado com painel, mesa decorada e detalhes de princesas.")
    .tipoEvento(TipoEvento.INFANTIL)
    .valor(new BigDecimal("1300"))
    .genero(Genero.MENINA)
    .imagemUrl("assets/orcamento/temas/infantil/princesas.jpg")
    .build());

Tema temaInf6 = temaRepository.save(Tema.builder()
    .nome("Barbie")
    .descricao("Tema rosa com painel, mesa decorada e clima fashion infantil.")
    .tipoEvento(TipoEvento.INFANTIL)
    .valor(new BigDecimal("1250"))
    .genero(Genero.MENINA)
    .imagemUrl("assets/orcamento/temas/infantil/barbie.jpeg")
    .build());

Tema temaInf7 = temaRepository.save(Tema.builder()
    .nome("Unicórnio")
    .descricao("Tema lúdico com tons suaves, arco-íris e composição encantada.")
    .tipoEvento(TipoEvento.INFANTIL)
    .valor(new BigDecimal("1200"))
    .genero(Genero.MENINA)
    .imagemUrl("assets/orcamento/temas/infantil/unicornio.jpg")
    .build());

Tema temaInf8 = temaRepository.save(Tema.builder()
    .nome("Bosque das Fadas")
    .descricao("Tema delicado com fadas, flores, luzes e elementos encantados para festa infantil.")
    .tipoEvento(TipoEvento.INFANTIL)
    .valor(new BigDecimal("1400"))
    .genero(Genero.MENINA)
    .imagemUrl("assets/orcamento/temas/infantil/bosque-das-fadas.jpg")
    .build());

Tema temaInf9 = temaRepository.save(Tema.builder()
    .nome("Glow Party")
    .descricao("Tema moderno com luzes, neon, brilho e decoração colorida para uma festa animada.")
    .tipoEvento(TipoEvento.INFANTIL)
    .valor(new BigDecimal("1450"))
    .genero(Genero.MENINA)
    .imagemUrl("assets/orcamento/temas/infantil/glow-party.jpg")
    .build());

Tema temaInf10 = temaRepository.save(Tema.builder()
    .nome("Minnie Mouse")
    .descricao("Tema clássico e delicado inspirado na Minnie, com decoração vermelha, rosa, laços e mesa temática.")
    .tipoEvento(TipoEvento.INFANTIL)
    .valor(new BigDecimal("1350"))
    .genero(Genero.MENINA)
    .imagemUrl("assets/orcamento/temas/infantil/minnie-mouse.jpg")
    .build());

Tema temaInf11 = temaRepository.save(Tema.builder()
    .nome("Patrulha Canina")
    .descricao("Tema divertido com painel, personagens e mesa decorada.")
    .tipoEvento(TipoEvento.INFANTIL)
    .valor(new BigDecimal("1250"))
    .genero(Genero.UNISSEX)
    .imagemUrl("assets/orcamento/temas/infantil/patrulha-canina.jpg")
    .build());

Tema temaInf12 = temaRepository.save(Tema.builder()
    .nome("Peppa Pig")
    .descricao("Tema infantil leve e colorido com composição para fotos.")
    .tipoEvento(TipoEvento.INFANTIL)
    .valor(new BigDecimal("1200"))
    .genero(Genero.UNISSEX)
    .imagemUrl("assets/orcamento/temas/infantil/peppa-pig.jpg")
    .build());


// ---- Temas 15 Anos ----

Tema tema15_0 = temaRepository.save(Tema.builder()
    .nome("Baile de Máscaras")
    .descricao("Tema elegante com máscaras, brilho, sofisticação e clima de baile para festa de 15 anos.")
    .tipoEvento(TipoEvento.QUINZE_ANOS)
    .valor(new BigDecimal("1800"))
    .categoriaTema(CategoriaTema.CLASSICO)
    .imagemUrl("assets/orcamento/temas/15-anos/baile-de-mascaras.jpg")
    .build());

Tema tema15_1 = temaRepository.save(Tema.builder()
    .nome("Glamour Neon")
    .descricao("Tema moderno com luzes neon, cores vibrantes e visual jovem para uma festa animada.")
    .tipoEvento(TipoEvento.QUINZE_ANOS)
    .valor(new BigDecimal("1900"))
    .categoriaTema(CategoriaTema.MODERNO)
    .imagemUrl("assets/orcamento/temas/15-anos/glamour-neon.jpg")
    .build());

Tema tema15_2 = temaRepository.save(Tema.builder()
    .nome("Jardim Floral")
    .descricao("Tema romântico com flores, delicadeza, luzes e composição elegante para festa de 15 anos.")
    .tipoEvento(TipoEvento.QUINZE_ANOS)
    .valor(new BigDecimal("2000"))
    .categoriaTema(CategoriaTema.ROMANTICO)
    .imagemUrl("assets/orcamento/temas/15-anos/jardim-floral-15-anos.jpg")
    .build());

Tema tema15_3 = temaRepository.save(Tema.builder()
    .nome("Sunset Party - Boho Chic")
    .descricao("Tema sofisticado com clima sunset, elementos boho, tons quentes e decoração elegante.")
    .tipoEvento(TipoEvento.QUINZE_ANOS)
    .valor(new BigDecimal("2100"))
    .categoriaTema(CategoriaTema.MODERNO)
    .imagemUrl("assets/orcamento/temas/15-anos/sunset-party-boho-chic.jpg")
    .build());


// ---- Temas Casamento / Floral / Corporativo ----

Tema temaPasta0 = temaRepository.save(Tema.builder()
    .nome("Casamento")
    .descricao("Tema elegante com ambientação clássica e composição visual para cerimônia e recepção.")
    .tipoEvento(TipoEvento.CASAMENTO)
    .valor(new BigDecimal("2200"))
    .imagemUrl("assets/orcamento/temas/casamento/casamento.jpg")
    .build());

Tema temaPasta1 = temaRepository.save(Tema.builder()
    .nome("Floral")
    .descricao("Tema delicado com flores, leveza e decoração romântica para um evento sofisticado.")
    .tipoEvento(TipoEvento.FLORAL)
    .valor(new BigDecimal("1800"))
    .imagemUrl("assets/orcamento/temas/floral/floral.jpg")
    .build());

Tema temaPasta2 = temaRepository.save(Tema.builder()
    .nome("Corporativo")
    .descricao("Tema profissional com composição clean, identidade visual e ambientação para eventos corporativos.")
    .tipoEvento(TipoEvento.CORPORATIVO)
    .valor(new BigDecimal("1900"))
    .imagemUrl("assets/orcamento/temas/corporativo/corporativo.jpg")
    .build());


// ---- Buffet ----

produtoRepository.save(Produto.builder()
    .nome("Buffet Básico")
    .categoria(CategoriaProduto.BUFFET)
    .tipoItem(TipoItem.OBRIGATORIO)
    .valor(new BigDecimal("2500"))
    .descricao("Salgados, frios, pratos quentes e estrutura essencial para os convidados.")
    .imagemUrl("assets/orcamento/buffet-basico.jpg")
    .build());

produtoRepository.save(Produto.builder()
    .nome("Buffet Premium")
    .categoria(CategoriaProduto.BUFFET)
    .tipoItem(TipoItem.OPCIONAL)
    .valor(new BigDecimal("4200"))
    .descricao("Opção gourmet com estações ao vivo e cardápio mais sofisticado.")
    .imagemUrl("assets/orcamento/buffet-premium.jpg")
    .build());

produtoRepository.save(Produto.builder()
    .nome("Coquetel")
    .categoria(CategoriaProduto.BUFFET)
    .tipoItem(TipoItem.OPCIONAL)
    .valor(new BigDecimal("2600"))
    .descricao("Finger foods, canapés e atendimento leve para eventos sociais.")
    .imagemUrl("assets/orcamento/buffet-coquetel.jpg")
    .build());


// ---- Bolo ----

produtoRepository.save(Produto.builder()
    .nome("Bolo Cenográfico")
    .categoria(CategoriaProduto.BOLO)
    .tipoItem(TipoItem.OPCIONAL)
    .valor(new BigDecimal("850"))
    .descricao("Bolo decorativo para compor a mesa principal e valorizar as fotos.")
    .imagemUrl("assets/orcamento/bolo-cenografico.jpg")
    .build());

produtoRepository.save(Produto.builder()
    .nome("Bolo Real Padrão (1 Andar)")
    .categoria(CategoriaProduto.BOLO)
    .tipoItem(TipoItem.OPCIONAL)
    .valor(new BigDecimal("700"))
    .descricao("Bolo real compacto com cobertura personalizada e acabamento delicado para eventos menores.")
    .imagemUrl("assets/orcamento/bolo-1-andar.jpg")
    .build());

produtoRepository.save(Produto.builder()
    .nome("Bolo Real Duplo (2 Andares)")
    .categoria(CategoriaProduto.BOLO)
    .tipoItem(TipoItem.OPCIONAL)
    .valor(new BigDecimal("950"))
    .descricao("Bolo real com dois andares, recheios variados e decoracao alinhada ao tema da festa.")
    .imagemUrl("assets/orcamento/bolo-2-andares.jpg")
    .build());

produtoRepository.save(Produto.builder()
    .nome("Bolo Real Majestoso (3 Andares)")
    .categoria(CategoriaProduto.BOLO)
    .tipoItem(TipoItem.OPCIONAL)
    .valor(new BigDecimal("1200"))
    .descricao("Bolo real com recheios variados, cobertura personalizada e acabamento tematico.")
    .imagemUrl("assets/orcamento/bolo-3-andares.jpg")
    .build());


// ---- Docinhos - linha clássica ----

produtoRepository.save(Produto.builder()
    .nome("Beijinho")
    .categoria(CategoriaProduto.DOCES)
    .tipoItem(TipoItem.OPCIONAL)
    .valor(new BigDecimal("2.5"))
    .descricao("Docinho tradicional — Beijinho.")
    .subcategoria("tradicional")
    .linha(Linha.CLASSICA)
    .unidadeMedida("unidade")
    .quantidadeMinima(25)
    .incremento(5)
    .imagemUrl("assets/orcamento/docinhos/beijinho.jpg")
    .build());

produtoRepository.save(Produto.builder()
    .nome("Branco Crocante")
    .categoria(CategoriaProduto.DOCES)
    .tipoItem(TipoItem.OPCIONAL)
    .valor(new BigDecimal("3"))
    .descricao("Docinho tradicional — Branco Crocante.")
    .subcategoria("tradicional")
    .linha(Linha.CLASSICA)
    .unidadeMedida("unidade")
    .quantidadeMinima(25)
    .incremento(5)
    .imagemUrl("assets/orcamento/docinhos/branco-crocante.jpg")
    .build());

produtoRepository.save(Produto.builder()
    .nome("Brigadeiro")
    .categoria(CategoriaProduto.DOCES)
    .tipoItem(TipoItem.OPCIONAL)
    .valor(new BigDecimal("3"))
    .descricao("Docinho tradicional — Brigadeiro.")
    .subcategoria("tradicional")
    .linha(Linha.CLASSICA)
    .unidadeMedida("unidade")
    .quantidadeMinima(25)
    .incremento(5)
    .imagemUrl("assets/orcamento/docinhos/brigadeiro.jpg")
    .build());

produtoRepository.save(Produto.builder()
    .nome("Brigadeiro Branco")
    .categoria(CategoriaProduto.DOCES)
    .tipoItem(TipoItem.OPCIONAL)
    .valor(new BigDecimal("3"))
    .descricao("Docinho tradicional — Brigadeiro Branco.")
    .subcategoria("tradicional")
    .linha(Linha.CLASSICA)
    .unidadeMedida("unidade")
    .quantidadeMinima(25)
    .incremento(5)
    .imagemUrl("assets/orcamento/docinhos/brigadeiro-branco.jpg")
    .build());

produtoRepository.save(Produto.builder()
    .nome("Brigadeiro Confete")
    .categoria(CategoriaProduto.DOCES)
    .tipoItem(TipoItem.OPCIONAL)
    .valor(new BigDecimal("3.2"))
    .descricao("Docinho tradicional — Brigadeiro Confete.")
    .subcategoria("tradicional")
    .linha(Linha.CLASSICA)
    .unidadeMedida("unidade")
    .quantidadeMinima(25)
    .incremento(5)
    .imagemUrl("assets/orcamento/docinhos/brigadeiro-confete.jpg")
    .build());

produtoRepository.save(Produto.builder()
    .nome("Brigadeiro de KitKat")
    .categoria(CategoriaProduto.DOCES)
    .tipoItem(TipoItem.OPCIONAL)
    .valor(new BigDecimal("3.8"))
    .descricao("Docinho gourmet — Brigadeiro de KitKat.")
    .subcategoria("gourmet")
    .linha(Linha.CLASSICA)
    .unidadeMedida("unidade")
    .quantidadeMinima(20)
    .incremento(5)
    .imagemUrl("assets/orcamento/docinhos/brigadeiro-kitkat.jpg")
    .build());

produtoRepository.save(Produto.builder()
    .nome("Brigadeiro de Oreo")
    .categoria(CategoriaProduto.DOCES)
    .tipoItem(TipoItem.OPCIONAL)
    .valor(new BigDecimal("3.5"))
    .descricao("Docinho gourmet — Brigadeiro de Oreo.")
    .subcategoria("gourmet")
    .linha(Linha.CLASSICA)
    .unidadeMedida("unidade")
    .quantidadeMinima(20)
    .incremento(5)
    .imagemUrl("assets/orcamento/docinhos/brigadeiro-oreo.jpg")
    .build());

produtoRepository.save(Produto.builder()
    .nome("Brigadeiro Sabor Churros")
    .categoria(CategoriaProduto.DOCES)
    .tipoItem(TipoItem.OPCIONAL)
    .valor(new BigDecimal("3.5"))
    .descricao("Docinho gourmet — Brigadeiro Sabor Churros.")
    .subcategoria("gourmet")
    .linha(Linha.CLASSICA)
    .unidadeMedida("unidade")
    .quantidadeMinima(20)
    .incremento(5)
    .imagemUrl("assets/orcamento/docinhos/brigadeiro-churros.jpg")
    .build());

produtoRepository.save(Produto.builder()
    .nome("Casadinho")
    .categoria(CategoriaProduto.DOCES)
    .tipoItem(TipoItem.OPCIONAL)
    .valor(new BigDecimal("3.2"))
    .descricao("Docinho tradicional — Casadinho.")
    .subcategoria("tradicional")
    .linha(Linha.CLASSICA)
    .unidadeMedida("unidade")
    .quantidadeMinima(25)
    .incremento(5)
    .imagemUrl("assets/orcamento/docinhos/casadinho.jpg")
    .build());

produtoRepository.save(Produto.builder()
    .nome("Chocoball")
    .categoria(CategoriaProduto.DOCES)
    .tipoItem(TipoItem.OPCIONAL)
    .valor(new BigDecimal("3.5"))
    .descricao("Docinho gourmet — Chocoball.")
    .subcategoria("gourmet")
    .linha(Linha.CLASSICA)
    .unidadeMedida("unidade")
    .quantidadeMinima(20)
    .incremento(5)
    .imagemUrl("assets/orcamento/docinhos/chocoball.jpg")
    .build());

produtoRepository.save(Produto.builder()
    .nome("Choco Branco")
    .categoria(CategoriaProduto.DOCES)
    .tipoItem(TipoItem.OPCIONAL)
    .valor(new BigDecimal("3.2"))
    .descricao("Docinho tradicional — Choco Branco.")
    .subcategoria("tradicional")
    .linha(Linha.CLASSICA)
    .unidadeMedida("unidade")
    .quantidadeMinima(25)
    .incremento(5)
    .imagemUrl("assets/orcamento/docinhos/choco-branco.jpg")
    .build());

produtoRepository.save(Produto.builder()
    .nome("Choco Crocante")
    .categoria(CategoriaProduto.DOCES)
    .tipoItem(TipoItem.OPCIONAL)
    .valor(new BigDecimal("3.5"))
    .descricao("Docinho gourmet — Choco Crocante.")
    .subcategoria("gourmet")
    .linha(Linha.CLASSICA)
    .unidadeMedida("unidade")
    .quantidadeMinima(20)
    .incremento(5)
    .imagemUrl("assets/orcamento/docinhos/choco-crocante.jpg")
    .build());

produtoRepository.save(Produto.builder()
    .nome("Chocolate com Cereja")
    .categoria(CategoriaProduto.DOCES)
    .tipoItem(TipoItem.OPCIONAL)
    .valor(new BigDecimal("4"))
    .descricao("Docinho gourmet — Chocolate com Cereja.")
    .subcategoria("gourmet")
    .linha(Linha.CLASSICA)
    .unidadeMedida("unidade")
    .quantidadeMinima(20)
    .incremento(5)
    .imagemUrl("assets/orcamento/docinhos/chocolate-cereja.jpg")
    .build());

produtoRepository.save(Produto.builder()
    .nome("Ferrero")
    .categoria(CategoriaProduto.DOCES)
    .tipoItem(TipoItem.OPCIONAL)
    .valor(new BigDecimal("4"))
    .descricao("Docinho gourmet — Ferrero.")
    .subcategoria("gourmet")
    .linha(Linha.CLASSICA)
    .unidadeMedida("unidade")
    .quantidadeMinima(20)
    .incremento(5)
    .imagemUrl("assets/orcamento/docinhos/ferrero.jpg")
    .build());

produtoRepository.save(Produto.builder()
    .nome("Kinder com Avelã")
    .categoria(CategoriaProduto.DOCES)
    .tipoItem(TipoItem.OPCIONAL)
    .valor(new BigDecimal("4"))
    .descricao("Docinho gourmet — Kinder com Avelã.")
    .subcategoria("gourmet")
    .linha(Linha.CLASSICA)
    .unidadeMedida("unidade")
    .quantidadeMinima(20)
    .incremento(5)
    .imagemUrl("assets/orcamento/docinhos/kinder-avela.jpg")
    .build());

produtoRepository.save(Produto.builder()
    .nome("Ninho com Nutella")
    .categoria(CategoriaProduto.DOCES)
    .tipoItem(TipoItem.OPCIONAL)
    .valor(new BigDecimal("3.8"))
    .descricao("Docinho gourmet — Ninho com Nutella.")
    .subcategoria("gourmet")
    .linha(Linha.CLASSICA)
    .unidadeMedida("unidade")
    .quantidadeMinima(20)
    .incremento(5)
    .imagemUrl("assets/orcamento/docinhos/ninho-nutela.jpg")
    .build());

produtoRepository.save(Produto.builder()
    .nome("Prestígio")
    .categoria(CategoriaProduto.DOCES)
    .tipoItem(TipoItem.OPCIONAL)
    .valor(new BigDecimal("3.5"))
    .descricao("Docinho gourmet — Prestígio.")
    .subcategoria("gourmet")
    .linha(Linha.CLASSICA)
    .unidadeMedida("unidade")
    .quantidadeMinima(20)
    .incremento(5)
    .imagemUrl("assets/orcamento/docinhos/prestigio.jpg")
    .build());

produtoRepository.save(Produto.builder()
    .nome("Sensação")
    .categoria(CategoriaProduto.DOCES)
    .tipoItem(TipoItem.OPCIONAL)
    .valor(new BigDecimal("3.5"))
    .descricao("Docinho gourmet — Sensação.")
    .subcategoria("gourmet")
    .linha(Linha.CLASSICA)
    .unidadeMedida("unidade")
    .quantidadeMinima(20)
    .incremento(5)
    .imagemUrl("assets/orcamento/docinhos/sensacao.jpg")
    .build());


// ---- Docinhos - linha premium (doces finos) ----

produtoRepository.save(Produto.builder()
    .nome("Brigadeiro de Pistache")
    .categoria(CategoriaProduto.DOCES)
    .tipoItem(TipoItem.OPCIONAL)
    .valor(new BigDecimal("5"))
    .descricao("Doce fino: Brigadeiro de Pistache.")
    .subcategoria("fino")
    .linha(Linha.PREMIUM)
    .unidadeMedida("unidade")
    .quantidadeMinima(25)
    .incremento(5)
    .imagemUrl("assets/orcamento/doces-finos/pistache-brigadeiro.jpg")
    .build());

produtoRepository.save(Produto.builder()
    .nome("Bombom Aberto de Pistache e Trufa Branca")
    .categoria(CategoriaProduto.DOCES)
    .tipoItem(TipoItem.OPCIONAL)
    .valor(new BigDecimal("6"))
    .descricao("Doce fino: Bombom Aberto de Pistache e Trufa Branca.")
    .subcategoria("fino")
    .linha(Linha.PREMIUM)
    .unidadeMedida("unidade")
    .quantidadeMinima(25)
    .incremento(5)
    .imagemUrl("assets/orcamento/doces-finos/bombom-pistache-trufa.jpg")
    .build());

produtoRepository.save(Produto.builder()
    .nome("Bombom de Caramelo Salgado com Flor de Sal")
    .categoria(CategoriaProduto.DOCES)
    .tipoItem(TipoItem.OPCIONAL)
    .valor(new BigDecimal("4"))
    .descricao("Doce fino: Bombom de Caramelo Salgado com Flor de Sal.")
    .subcategoria("fino")
    .linha(Linha.PREMIUM)
    .unidadeMedida("unidade")
    .quantidadeMinima(25)
    .incremento(5)
    .imagemUrl("assets/orcamento/doces-finos/caramelo-flor-de-sal.jpg")
    .build());

produtoRepository.save(Produto.builder()
    .nome("Bombom de Champagne com Frutas Vermelhas")
    .categoria(CategoriaProduto.DOCES)
    .tipoItem(TipoItem.OPCIONAL)
    .valor(new BigDecimal("6"))
    .descricao("Doce fino: Bombom de Champagne com Frutas Vermelhas.")
    .subcategoria("fino")
    .linha(Linha.PREMIUM)
    .unidadeMedida("unidade")
    .quantidadeMinima(25)
    .incremento(5)
    .imagemUrl("assets/orcamento/doces-finos/champagne-frutas-vermelhas.jpg")
    .build());

produtoRepository.save(Produto.builder()
    .nome("Bombom de Coco Queimado Trufado")
    .categoria(CategoriaProduto.DOCES)
    .tipoItem(TipoItem.OPCIONAL)
    .valor(new BigDecimal("4.5"))
    .descricao("Doce fino: Bombom de Coco Queimado Trufado.")
    .subcategoria("fino")
    .linha(Linha.PREMIUM)
    .unidadeMedida("unidade")
    .quantidadeMinima(25)
    .incremento(5)
    .imagemUrl("assets/orcamento/doces-finos/coco-queimado-trufado.jpg")
    .build());

produtoRepository.save(Produto.builder()
    .nome("Caixinha de Chocolate com Physalis")
    .categoria(CategoriaProduto.DOCES)
    .tipoItem(TipoItem.OPCIONAL)
    .valor(new BigDecimal("5"))
    .descricao("Doce fino: Caixinha de Chocolate com Physalis.")
    .subcategoria("fino")
    .linha(Linha.PREMIUM)
    .unidadeMedida("unidade")
    .quantidadeMinima(25)
    .incremento(5)
    .imagemUrl("assets/orcamento/doces-finos/caixinha-physalis.jpg")
    .build());

produtoRepository.save(Produto.builder()
    .nome("Camafeu de Nozes")
    .categoria(CategoriaProduto.DOCES)
    .tipoItem(TipoItem.OPCIONAL)
    .valor(new BigDecimal("4.5"))
    .descricao("Doce fino: Camafeu de Nozes.")
    .subcategoria("fino")
    .linha(Linha.PREMIUM)
    .unidadeMedida("unidade")
    .quantidadeMinima(25)
    .incremento(5)
    .imagemUrl("assets/orcamento/doces-finos/camafeu-nozes.jpg")
    .build());

produtoRepository.save(Produto.builder()
    .nome("Copinho de Cappuccino com Ampola Saborizante")
    .categoria(CategoriaProduto.DOCES)
    .tipoItem(TipoItem.OPCIONAL)
    .valor(new BigDecimal("7.5"))
    .descricao("Doce fino: Copinho de Cappuccino com Ampola Saborizante.")
    .subcategoria("fino")
    .linha(Linha.PREMIUM)
    .unidadeMedida("unidade")
    .quantidadeMinima(20)
    .incremento(5)
    .imagemUrl("assets/orcamento/doces-finos/cappuccino-ampola.jpg")
    .build());

produtoRepository.save(Produto.builder()
    .nome("Damasco Recheado com Creme de Amêndoas")
    .categoria(CategoriaProduto.DOCES)
    .tipoItem(TipoItem.OPCIONAL)
    .valor(new BigDecimal("5.5"))
    .descricao("Doce fino: Damasco Recheado com Creme de Amêndoas.")
    .subcategoria("fino")
    .linha(Linha.PREMIUM)
    .unidadeMedida("unidade")
    .quantidadeMinima(25)
    .incremento(5)
    .imagemUrl("assets/orcamento/doces-finos/damasco-amendoas.jpg")
    .build());

produtoRepository.save(Produto.builder()
    .nome("Fudge de Chocolate Belga com Macadâmias")
    .categoria(CategoriaProduto.DOCES)
    .tipoItem(TipoItem.OPCIONAL)
    .valor(new BigDecimal("6"))
    .descricao("Doce fino: Fudge de Chocolate Belga com Macadâmias.")
    .subcategoria("fino")
    .linha(Linha.PREMIUM)
    .unidadeMedida("unidade")
    .quantidadeMinima(25)
    .incremento(5)
    .imagemUrl("assets/orcamento/doces-finos/fudge-belga-macadamia.jpg")
    .build());

produtoRepository.save(Produto.builder()
    .nome("Macarons Gourmet")
    .categoria(CategoriaProduto.DOCES)
    .tipoItem(TipoItem.OPCIONAL)
    .valor(new BigDecimal("4.5"))
    .descricao("Doce fino: Macarons Gourmet.")
    .subcategoria("fino")
    .linha(Linha.PREMIUM)
    .unidadeMedida("unidade")
    .quantidadeMinima(20)
    .incremento(5)
    .imagemUrl("assets/orcamento/doces-finos/macarons-gourmet.jpg")
    .build());

produtoRepository.save(Produto.builder()
    .nome("Mini Tartelete de Limão Siciliano com Merengue Suíço")
    .categoria(CategoriaProduto.DOCES)
    .tipoItem(TipoItem.OPCIONAL)
    .valor(new BigDecimal("7.5"))
    .descricao("Doce fino: Mini Tartelete de Limão Siciliano com Merengue Suíço.")
    .subcategoria("fino")
    .linha(Linha.PREMIUM)
    .unidadeMedida("unidade")
    .quantidadeMinima(20)
    .incremento(5)
    .imagemUrl("assets/orcamento/doces-finos/tartelete-limao-siciliano.jpg")
    .build());

produtoRepository.save(Produto.builder()
    .nome("Pão de Mel Fino com Banho de Chocolate Decorado")
    .categoria(CategoriaProduto.DOCES)
    .tipoItem(TipoItem.OPCIONAL)
    .valor(new BigDecimal("5.5"))
    .descricao("Doce fino: Pão de Mel Fino com Banho de Chocolate Decorado.")
    .subcategoria("fino")
    .linha(Linha.PREMIUM)
    .unidadeMedida("unidade")
    .quantidadeMinima(25)
    .incremento(5)
    .imagemUrl("assets/orcamento/doces-finos/pao-de-mel-fino.jpg")
    .build());


// ---- Salgadinhos tradicionais ----

produtoRepository.save(Produto.builder()
    .nome("Coxinha de Frango")
    .categoria(CategoriaProduto.SALGADOS)
    .tipoItem(TipoItem.OPCIONAL)
    .valor(new BigDecimal("0.85"))
    .descricao("Salgadinho tradicional: Coxinha de Frango.")
    .subcategoria("tradicional")
    .linha(Linha.CLASSICA)
    .unidadeMedida("unidade")
    .quantidadeMinima(50)
    .incremento(10)
    .imagemUrl("assets/orcamento/salgadinhos/coxinha-frango.jpg")
    .build());

produtoRepository.save(Produto.builder()
    .nome("Risole de Carne")
    .categoria(CategoriaProduto.SALGADOS)
    .tipoItem(TipoItem.OPCIONAL)
    .valor(new BigDecimal("0.9"))
    .descricao("Salgadinho tradicional: Risole de Carne.")
    .subcategoria("tradicional")
    .linha(Linha.CLASSICA)
    .unidadeMedida("unidade")
    .quantidadeMinima(50)
    .incremento(10)
    .imagemUrl("assets/orcamento/salgadinhos/risole-carne.jpg")
    .build());

produtoRepository.save(Produto.builder()
    .nome("Risole de Queijo")
    .categoria(CategoriaProduto.SALGADOS)
    .tipoItem(TipoItem.OPCIONAL)
    .valor(new BigDecimal("0.9"))
    .descricao("Salgadinho tradicional: Risole de Queijo.")
    .subcategoria("tradicional")
    .linha(Linha.CLASSICA)
    .unidadeMedida("unidade")
    .quantidadeMinima(50)
    .incremento(10)
    .imagemUrl("assets/orcamento/salgadinhos/risole-queijo.jpg")
    .build());

produtoRepository.save(Produto.builder()
    .nome("Bolinha de Queijo")
    .categoria(CategoriaProduto.SALGADOS)
    .tipoItem(TipoItem.OPCIONAL)
    .valor(new BigDecimal("0.95"))
    .descricao("Salgadinho tradicional: Bolinha de Queijo.")
    .subcategoria("tradicional")
    .linha(Linha.CLASSICA)
    .unidadeMedida("unidade")
    .quantidadeMinima(50)
    .incremento(10)
    .imagemUrl("assets/orcamento/salgadinhos/bolinha-queijo.jpg")
    .build());

produtoRepository.save(Produto.builder()
    .nome("Quibe")
    .categoria(CategoriaProduto.SALGADOS)
    .tipoItem(TipoItem.OPCIONAL)
    .valor(new BigDecimal("1"))
    .descricao("Salgadinho tradicional: Quibe.")
    .subcategoria("tradicional")
    .linha(Linha.CLASSICA)
    .unidadeMedida("unidade")
    .quantidadeMinima(50)
    .incremento(10)
    .imagemUrl("assets/orcamento/salgadinhos/quibe.jpg")
    .build());

produtoRepository.save(Produto.builder()
    .nome("Croquete de Carne")
    .categoria(CategoriaProduto.SALGADOS)
    .tipoItem(TipoItem.OPCIONAL)
    .valor(new BigDecimal("0.9"))
    .descricao("Salgadinho tradicional: Croquete de Carne.")
    .subcategoria("tradicional")
    .linha(Linha.CLASSICA)
    .unidadeMedida("unidade")
    .quantidadeMinima(50)
    .incremento(10)
    .imagemUrl("assets/orcamento/salgadinhos/croquete-carne.jpg")
    .build());

produtoRepository.save(Produto.builder()
    .nome("Empada de Frango")
    .categoria(CategoriaProduto.SALGADOS)
    .tipoItem(TipoItem.OPCIONAL)
    .valor(new BigDecimal("1.1"))
    .descricao("Salgadinho tradicional: Empada de Frango.")
    .subcategoria("tradicional")
    .linha(Linha.CLASSICA)
    .unidadeMedida("unidade")
    .quantidadeMinima(50)
    .incremento(10)
    .imagemUrl("assets/orcamento/salgadinhos/empada-frango.jpg")
    .build());

produtoRepository.save(Produto.builder()
    .nome("Pastel Assado de Carne")
    .categoria(CategoriaProduto.SALGADOS)
    .tipoItem(TipoItem.OPCIONAL)
    .valor(new BigDecimal("0.9"))
    .descricao("Salgadinho tradicional: Pastel Assado de Carne.")
    .subcategoria("tradicional")
    .linha(Linha.CLASSICA)
    .unidadeMedida("unidade")
    .quantidadeMinima(50)
    .incremento(10)
    .imagemUrl("assets/orcamento/salgadinhos/pastel-assado-carne.jpg")
    .build());

produtoRepository.save(Produto.builder()
    .nome("Esfiha de Carne")
    .categoria(CategoriaProduto.SALGADOS)
    .tipoItem(TipoItem.OPCIONAL)
    .valor(new BigDecimal("0.95"))
    .descricao("Salgadinho tradicional: Esfiha de Carne.")
    .subcategoria("tradicional")
    .linha(Linha.CLASSICA)
    .unidadeMedida("unidade")
    .quantidadeMinima(50)
    .incremento(10)
    .imagemUrl("assets/orcamento/salgadinhos/esfiha-carne.jpg")
    .build());

produtoRepository.save(Produto.builder()
    .nome("Mini Cachorro Quente")
    .categoria(CategoriaProduto.SALGADOS)
    .tipoItem(TipoItem.OPCIONAL)
    .valor(new BigDecimal("1.2"))
    .descricao("Salgadinho tradicional: Mini Cachorro Quente.")
    .subcategoria("tradicional")
    .linha(Linha.CLASSICA)
    .unidadeMedida("unidade")
    .quantidadeMinima(50)
    .incremento(10)
    .imagemUrl("assets/orcamento/salgadinhos/mini-cachorro-quente.jpg")
    .build());


// ---- Salgadinhos sofisticados ----

produtoRepository.save(Produto.builder()
    .nome("Camarão Empanado com Catupiry")
    .categoria(CategoriaProduto.SALGADOS)
    .tipoItem(TipoItem.OPCIONAL)
    .valor(new BigDecimal("5"))
    .descricao("Salgadinho sofisticado: Camarão Empanado com Catupiry.")
    .subcategoria("sofisticado")
    .linha(Linha.PREMIUM)
    .unidadeMedida("unidade")
    .quantidadeMinima(20)
    .incremento(5)
    .imagemUrl("assets/orcamento/salgadinhos/camarao-empanado-catupiry.jpg")
    .build());

produtoRepository.save(Produto.builder()
    .nome("Risole de Camarão com Catupiry")
    .categoria(CategoriaProduto.SALGADOS)
    .tipoItem(TipoItem.OPCIONAL)
    .valor(new BigDecimal("3.5"))
    .descricao("Salgadinho sofisticado: Risole de Camarão com Catupiry.")
    .subcategoria("sofisticado")
    .linha(Linha.PREMIUM)
    .unidadeMedida("unidade")
    .quantidadeMinima(20)
    .incremento(5)
    .imagemUrl("assets/orcamento/salgadinhos/risole-camarao-catupiry.jpg")
    .build());

produtoRepository.save(Produto.builder()
    .nome("Mini Quiche de Alho-Poró com Bacon")
    .categoria(CategoriaProduto.SALGADOS)
    .tipoItem(TipoItem.OPCIONAL)
    .valor(new BigDecimal("4.25"))
    .descricao("Salgadinho sofisticado: Mini Quiche de Alho-Poró com Bacon.")
    .subcategoria("sofisticado")
    .linha(Linha.PREMIUM)
    .unidadeMedida("unidade")
    .quantidadeMinima(20)
    .incremento(5)
    .imagemUrl("assets/orcamento/salgadinhos/mini-quiche-alho-poro-bacon.jpg")
    .build());

produtoRepository.save(Produto.builder()
    .nome("Espetinho de Filé Mignon ao Molho Madeira")
    .categoria(CategoriaProduto.SALGADOS)
    .tipoItem(TipoItem.OPCIONAL)
    .valor(new BigDecimal("6"))
    .descricao("Salgadinho sofisticado: Espetinho de Filé Mignon ao Molho Madeira.")
    .subcategoria("sofisticado")
    .linha(Linha.PREMIUM)
    .unidadeMedida("unidade")
    .quantidadeMinima(20)
    .incremento(5)
    .imagemUrl("assets/orcamento/salgadinhos/espetinho-file-mignon.jpg")
    .build());

produtoRepository.save(Produto.builder()
    .nome("Coxinha de Costela com Páprica Defumada")
    .categoria(CategoriaProduto.SALGADOS)
    .tipoItem(TipoItem.OPCIONAL)
    .valor(new BigDecimal("4.25"))
    .descricao("Salgadinho sofisticado: Coxinha de Costela com Páprica Defumada.")
    .subcategoria("sofisticado")
    .linha(Linha.PREMIUM)
    .unidadeMedida("unidade")
    .quantidadeMinima(20)
    .incremento(5)
    .imagemUrl("assets/orcamento/salgadinhos/coxinha-costela.jpg")
    .build());

produtoRepository.save(Produto.builder()
    .nome("Mini Bruschetta de Tomate Seco com Brie")
    .categoria(CategoriaProduto.SALGADOS)
    .tipoItem(TipoItem.OPCIONAL)
    .valor(new BigDecimal("4.75"))
    .descricao("Salgadinho sofisticado: Mini Bruschetta de Tomate Seco com Brie.")
    .subcategoria("sofisticado")
    .linha(Linha.PREMIUM)
    .unidadeMedida("unidade")
    .quantidadeMinima(20)
    .incremento(5)
    .imagemUrl("assets/orcamento/salgadinhos/mini-bruschetta-brie.jpg")
    .build());


// ---- Bebidas extras ----

produtoRepository.save(Produto.builder()
    .nome("Cerveja")
    .categoria(CategoriaProduto.BEBIDAS)
    .tipoItem(TipoItem.OPCIONAL)
    .valor(new BigDecimal("9"))
    .descricao("Bebida extra: Cerveja.")
    .unidadeMedida("unidade")
    .quantidadeMinima(12)
    .incremento(6)
    .build());

produtoRepository.save(Produto.builder()
    .nome("Espumante")
    .categoria(CategoriaProduto.BEBIDAS)
    .tipoItem(TipoItem.OPCIONAL)
    .valor(new BigDecimal("16"))
    .descricao("Bebida extra: Espumante.")
    .unidadeMedida("unidade")
    .quantidadeMinima(10)
    .incremento(5)
    .build());

produtoRepository.save(Produto.builder()
    .nome("Drink Autoral")
    .categoria(CategoriaProduto.BEBIDAS)
    .tipoItem(TipoItem.OPCIONAL)
    .valor(new BigDecimal("22"))
    .descricao("Bebida extra: Drink Autoral.")
    .unidadeMedida("unidade")
    .quantidadeMinima(10)
    .incremento(5)
    .build());

produtoRepository.save(Produto.builder()
    .nome("Vinho")
    .categoria(CategoriaProduto.BEBIDAS)
    .tipoItem(TipoItem.OPCIONAL)
    .valor(new BigDecimal("65"))
    .descricao("Bebida extra: Vinho.")
    .unidadeMedida("unidade")
    .quantidadeMinima(2)
    .incremento(1)
    .build());

produtoRepository.save(Produto.builder()
    .nome("Energético")
    .categoria(CategoriaProduto.BEBIDAS)
    .tipoItem(TipoItem.OPCIONAL)
    .valor(new BigDecimal("12"))
    .descricao("Bebida extra: Energético.")
    .unidadeMedida("unidade")
    .quantidadeMinima(6)
    .incremento(6)
    .build());


// ---- Decoração ----

produtoRepository.save(Produto.builder()
    .nome("Arco de Balões Clássico")
    .categoria(CategoriaProduto.DECORACAO)
    .tipoItem(TipoItem.OPCIONAL)
    .valor(new BigDecimal("90"))
    .descricao("Arco de balões em até 2 cores, montado no local no dia do evento.")
    .subcategoria("balao")
    .unidadeMedida("metro")
    .quantidadeMinima(3)
    .incremento(1)
    .fornecimento(Fornecimento.PARCEIRO)
    .itensInclusos("Balões nas cores escolhidas, Estrutura de sustentação, Montagem no local")
    .itensNaoInclusos("Hélio, Balões metalizados especiais, Personagens licenciados")
    .imagemUrl("assets/orcamento/decoracao/arco-balao-classico.jpg")
    .build());

produtoRepository.save(Produto.builder()
    .nome("Painel com Balões")
    .categoria(CategoriaProduto.DECORACAO)
    .tipoItem(TipoItem.OPCIONAL)
    .valor(new BigDecimal("350"))
    .descricao("Painel decorativo com composição de balões para fotos e mesa principal.")
    .subcategoria("balao")
    .unidadeMedida("pacote")
    .quantidadeMinima(1)
    .incremento(1)
    .fornecimento(Fornecimento.PARCEIRO)
    .itensInclusos("Balões em cores combinadas, Montagem no local, Composição visual para fotos")
    .itensNaoInclusos("Painel 3D personalizado, Personagens licenciados, Iluminação especial")
    .imagemUrl("assets/orcamento/decoracao/painel-baloes.jpg")
    .build());

produtoRepository.save(Produto.builder()
    .nome("Coluna de Balões")
    .categoria(CategoriaProduto.DECORACAO)
    .tipoItem(TipoItem.OPCIONAL)
    .valor(new BigDecimal("120"))
    .descricao("Coluna decorativa de balões para entrada, salão ou mesa principal.")
    .subcategoria("balao")
    .unidadeMedida("unidade")
    .quantidadeMinima(2)
    .incremento(1)
    .fornecimento(Fornecimento.PARCEIRO)
    .itensInclusos("Balões nas cores escolhidas, Base de sustentação, Montagem no local")
    .itensNaoInclusos("Hélio, Balões personalizados, Retirada fora do horário combinado")
    .imagemUrl("assets/orcamento/decoracao/coluna-baloes.jpg")
    .build());

produtoRepository.save(Produto.builder()
    .nome("Cenografia Temática Personalizada")
    .categoria(CategoriaProduto.DECORACAO)
    .tipoItem(TipoItem.OPCIONAL)
    .valor(new BigDecimal("0"))
    .descricao("Ambientação temática completa do salão, sob orçamento conforme o tema escolhido.")
    .subcategoria("cenografia")
    .unidadeMedida("pacote")
    .quantidadeMinima(1)
    .incremento(1)
    .fornecimento(Fornecimento.PARCEIRO)
    .itensInclusos("Projeto de ambientação, Elementos cenográficos, Montagem e desmontagem")
    .itensNaoInclusos("Mobiliário especial, Iluminação cênica, Itens fora do tema contratado")
    .sobOrcamento(true)
    .precoReferencia("a partir de R$ 800,00")
    .imagemUrl("assets/orcamento/decoracao/cenografia-tematica.jpg")
    .build());

produtoRepository.save(Produto.builder()
    .nome("Painel 3D Personalizado")
    .categoria(CategoriaProduto.DECORACAO)
    .tipoItem(TipoItem.OPCIONAL)
    .valor(new BigDecimal("0"))
    .descricao("Painel cenográfico personalizado para tema infantil, 15 anos, casamento ou evento corporativo.")
    .subcategoria("cenografia")
    .unidadeMedida("pacote")
    .quantidadeMinima(1)
    .incremento(1)
    .fornecimento(Fornecimento.PARCEIRO)
    .itensInclusos("Criação visual do painel, Estrutura decorativa, Montagem no local")
    .itensNaoInclusos("Personagens licenciados, Iluminação especial, Mobiliário extra")
    .sobOrcamento(true)
    .precoReferencia("a partir de R$ 600,00")
    .imagemUrl("assets/orcamento/decoracao/painel-3d-personalizado.jpg")
    .build());

produtoRepository.save(Produto.builder()
    .nome("Pacote de Iluminação Cênica")
    .categoria(CategoriaProduto.DECORACAO)
    .tipoItem(TipoItem.OPCIONAL)
    .valor(new BigDecimal("450"))
    .descricao("Iluminação para destacar a pista, mesa principal e ambiente do evento.")
    .subcategoria("iluminacao")
    .unidadeMedida("diaria")
    .quantidadeMinima(1)
    .incremento(1)
    .fornecimento(Fornecimento.PARCEIRO)
    .itensInclusos("Canhões de luz, Efeitos de iluminação, Instalação no local")
    .itensNaoInclusos("Gerador de energia, Sonorização, Operador exclusivo se não informado no contrato")
    .imagemUrl("assets/orcamento/decoracao/iluminacao-cenica.jpg")
    .build());

produtoRepository.save(Produto.builder()
    .nome("Máquina de Fumaça")
    .categoria(CategoriaProduto.DECORACAO)
    .tipoItem(TipoItem.OPCIONAL)
    .valor(new BigDecimal("180"))
    .descricao("Efeito de fumaça para pista de dança, entrada especial ou momento do parabéns.")
    .subcategoria("iluminacao")
    .unidadeMedida("diaria")
    .quantidadeMinima(1)
    .incremento(1)
    .fornecimento(Fornecimento.PARCEIRO)
    .itensInclusos("Máquina de fumaça, Fluido básico, Instalação no local")
    .itensNaoInclusos("Operação contínua durante todo o evento, Reposição extra de fluido")
    .imagemUrl("assets/orcamento/decoracao/maquina-fumaca.jpg")
    .build());

produtoRepository.save(Produto.builder()
    .nome("Kit de Personalização — Arquivo Digital")
    .categoria(CategoriaProduto.DECORACAO)
    .tipoItem(TipoItem.OPCIONAL)
    .valor(new BigDecimal("35"))
    .descricao("Você recebe os arquivos digitais e providencia impressão e montagem.")
    .subcategoria("personalizacao")
    .unidadeMedida("pacote")
    .quantidadeMinima(1)
    .incremento(1)
    .fornecimento(Fornecimento.CASA)
    .itensInclusos("Arte digital no tema escolhido, Arquivos em alta resolução")
    .itensNaoInclusos("Impressão física, Material, Montagem no local")
    .imagemUrl("assets/orcamento/decoracao/personalizacao-digital.jpg")
    .build());

produtoRepository.save(Produto.builder()
    .nome("Kit de Personalização — Material Pronto")
    .categoria(CategoriaProduto.DECORACAO)
    .tipoItem(TipoItem.OPCIONAL)
    .valor(new BigDecimal("80"))
    .descricao("Material impresso e recortado entregue antes do evento.")
    .subcategoria("personalizacao")
    .unidadeMedida("pacote")
    .quantidadeMinima(1)
    .incremento(1)
    .fornecimento(Fornecimento.CASA)
    .itensInclusos("Material impresso, Recorte dos itens, Entrega antes do evento")
    .itensNaoInclusos("Montagem no local, Reposição em caso de dano")
    .imagemUrl("assets/orcamento/decoracao/personalizacao-material.jpg")
    .build());

produtoRepository.save(Produto.builder()
    .nome("Kit de Personalização — All Inclusive")
    .categoria(CategoriaProduto.DECORACAO)
    .tipoItem(TipoItem.OPCIONAL)
    .valor(new BigDecimal("220"))
    .descricao("Tudo pronto e montado no local antes da festa começar.")
    .subcategoria("personalizacao")
    .unidadeMedida("pacote")
    .quantidadeMinima(1)
    .incremento(1)
    .fornecimento(Fornecimento.CASA)
    .itensInclusos("Material personalizado, Montagem completa no local, Equipe própria no dia do evento")
    .itensNaoInclusos("Alterações de última hora, Itens fora do tema contratado")
    .imagemUrl("assets/orcamento/decoracao/personalizacao-all-inclusive.jpg")
    .build());

produtoRepository.save(Produto.builder()
    .nome("Mesa + 4 Cadeiras Padrão")
    .categoria(CategoriaProduto.DECORACAO)
    .tipoItem(TipoItem.OPCIONAL)
    .valor(new BigDecimal("20"))
    .descricao("Conjunto básico de mesa com 4 cadeiras para convidados.")
    .subcategoria("mobiliario")
    .unidadeMedida("unidade")
    .quantidadeMinima(5)
    .incremento(1)
    .fornecimento(Fornecimento.CASA)
    .itensInclusos("1 mesa, 4 cadeiras, Montagem prévia")
    .itensNaoInclusos("Toalha decorada, Capa de cadeira, Mobiliário premium")
    .imagemUrl("assets/orcamento/decoracao/mesa-cadeira-padrao.jpg")
    .build());

produtoRepository.save(Produto.builder()
    .nome("Móveis Provençais")
    .categoria(CategoriaProduto.DECORACAO)
    .tipoItem(TipoItem.OPCIONAL)
    .valor(new BigDecimal("350"))
    .descricao("Móveis decorativos para mesa principal, doces, lembrancinhas ou cenário de fotos.")
    .subcategoria("mobiliario")
    .unidadeMedida("pacote")
    .quantidadeMinima(1)
    .incremento(1)
    .fornecimento(Fornecimento.PARCEIRO)
    .itensInclusos("Conjunto de móveis decorativos, Montagem no local, Organização visual básica")
    .itensNaoInclusos("Decoração floral, Personalização temática, Transporte fora da região combinada")
    .imagemUrl("assets/orcamento/decoracao/moveis-provencais.jpg")
    .build());


// ---- Música e Animação ----

produtoRepository.save(Produto.builder()
    .nome("DJ & Música")
    .categoria(CategoriaProduto.MUSICA)
    .tipoItem(TipoItem.OPCIONAL)
    .valor(new BigDecimal("800"))
    .descricao("DJ profissional 6h")
    .subcategoria("musica")
    .duracaoHoras(6)
    .imagemUrl("assets/orcamento/musica-animacao/dj-musica.jpg")
    .build());

produtoRepository.save(Produto.builder()
    .nome("Animadores")
    .categoria(CategoriaProduto.MUSICA)
    .tipoItem(TipoItem.OPCIONAL)
    .valor(new BigDecimal("1200"))
    .descricao("Equipe de entretenimento")
    .subcategoria("animacao")
    .duracaoHoras(6)
    .imagemUrl("assets/orcamento/musica-animacao/animadores.jpg")
    .build());

produtoRepository.save(Produto.builder()
    .nome("Fotografia")
    .categoria(CategoriaProduto.MUSICA)
    .tipoItem(TipoItem.OPCIONAL)
    .valor(new BigDecimal("1500"))
    .descricao("Fotógrafo profissional")
    .subcategoria("experiencia")
    .duracaoHoras(6)
    .imagemUrl("assets/orcamento/musica-animacao/fotografia.jpg")
    .build());

produtoRepository.save(Produto.builder()
    .nome("Bartender")
    .categoria(CategoriaProduto.MUSICA)
    .tipoItem(TipoItem.OPCIONAL)
    .valor(new BigDecimal("650"))
    .descricao("Open bar premium")
    .subcategoria("show")
    .duracaoHoras(6)
    .imagemUrl("assets/orcamento/musica-animacao/bartender.jpg")
    .build());
        System.out.println("Catálogo completo carregado: temas e produtos do wizard de orçamento.");
        System.out.println("Login de teste: admin@festaplanner.com / admin123 | cliente@teste.com / cliente123");
    }
}
