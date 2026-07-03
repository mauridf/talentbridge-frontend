-- =====================================================
-- Script: seed-admin.sql
-- Descrição: Cria o perfil ADMIN e o usuário administrador
-- Uso: psql -U <user> -d <database> -f seed-admin.sql
-- =====================================================

-- Antes de executar, gere o hash BCrypt da sua senha:
-- Em C#: BCrypt.Net.BCrypt.HashPassword("sua-senha-aqui")
-- Online: https://bcrypt-generator.com ( usar cost factor 11+ )

DO $$
DECLARE
    v_perfil_id UUID;
    v_admin_id UUID;
    v_senha_hash TEXT := '$2a$11$COLOQUE_AQUI_O_HASH_BCRYPT';
    -- ↑ Substitua pelo hash gerado. Exemplo de geração:
    -- dotnet fsi -e "BCrypt.Net.BCrypt.HashPassword(\"MinhaSenha@123\")"
BEGIN

    -- 1. Cria o perfil ADMIN se não existir
    INSERT INTO "Perfils" ("Id", "Codigo", "Nome", "CreatedAt", "UpdatedAt")
    VALUES (gen_random_uuid(), 'ADMIN', 'Administrador', NOW(), NOW())
    ON CONFLICT ("Codigo") DO NOTHING
    RETURNING "Id" INTO v_perfil_id;

    -- Se já existia, busca o ID
    IF v_perfil_id IS NULL THEN
        SELECT "Id" INTO v_perfil_id FROM "Perfils" WHERE "Codigo" = 'ADMIN';
    END IF;

    -- 2. Cria o usuário administrador
    INSERT INTO "Usuarios" (
        "Id",
        "Nome",
        "Email",
        "SenhaHash",
        "Telefone",
        "Status",
        "OrigemCadastro",
        "PerfilId",
        "Discriminator",
        "CreatedAt",
        "UpdatedAt"
    )
    VALUES (
        gen_random_uuid(),
        'Administrador TalentBridge',
        'mauridf@gmail.com',
        v_senha_hash,
        '',
        1,              -- Ativo
        1,              -- Web
        v_perfil_id,
        'Usuario',      -- TPH base (sem herança específica)
        NOW(),
        NOW()
    )
    ON CONFLICT ("Email") DO UPDATE
        SET "PerfilId" = v_perfil_id,
            "Status" = 1,
            "UpdatedAt" = NOW();

    RAISE NOTICE 'Admin criado/atualizado com email: mauridf@gmail.com';

END $$;
