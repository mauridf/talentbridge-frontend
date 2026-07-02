import { Directive, Input, TemplateRef, ViewContainerRef, OnInit, OnDestroy } from '@angular/core';
import { TokenService } from '../../core/services/token.service';
import { PerfilUsuario } from '../../core/models/auth.models';
import { Subscription } from 'rxjs';

/**
 * Diretiva estrutural para controle de permissões
 * Exibe/esconde elementos baseado no perfil do usuário
 *
 * Uso:
 * <!-- Apenas perfis específicos -->
 * <button *appPermissao="['ADMIN', 'GESTOR_EMPRESA']">Gerenciar</button>
 *
 * <!-- Modo inverso: esconde para perfis específicos -->
 * <div *appPermissao="['CANDIDATO']; negar: true">Conteúdo empresa</div>
 */
@Directive({
  selector: '[appPermissao]',
  standalone: true,
})
export class PermissaoDirective implements OnInit, OnDestroy {
  private perfisPermitidos: PerfilUsuario[] = [];
  private negar: boolean = false;
  private subscription?: Subscription;

  constructor(
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef,
    private tokenService: TokenService,
  ) {}

  /**
   * Input principal: array de perfis ou string única
   */
  @Input()
  set appPermissao(perfis: PerfilUsuario[] | PerfilUsuario | string) {
    // Normaliza para array
    if (typeof perfis === 'string') {
      this.perfisPermitidos = [perfis as PerfilUsuario];
    } else if (Array.isArray(perfis)) {
      this.perfisPermitidos = perfis;
    } else {
      this.perfisPermitidos = [perfis as PerfilUsuario];
    }
    this.atualizarVisibilidade();
  }

  /**
   * Flag para negar a lógica (esconder para os perfis listados)
   */
  @Input()
  set appPermissaoNegar(valor: boolean) {
    this.negar = valor === true;
    this.atualizarVisibilidade();
  }

  ngOnInit(): void {
    this.atualizarVisibilidade();
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

  /**
   * Verifica permissão e exibe/esconde o elemento
   */
  private atualizarVisibilidade(): void {
    const claims = this.tokenService.obterClaims();

    if (!claims || !claims.perfil) {
      this.viewContainer.clear();
      return;
    }

    const perfilUsuario = claims.perfil as PerfilUsuario;
    const temPermissao = this.perfisPermitidos.includes(perfilUsuario);

    // Se negar=true, inverte a lógica
    const deveExibir = this.negar ? !temPermissao : temPermissao;

    if (deveExibir) {
      this.viewContainer.createEmbeddedView(this.templateRef);
    } else {
      this.viewContainer.clear();
    }
  }
}
