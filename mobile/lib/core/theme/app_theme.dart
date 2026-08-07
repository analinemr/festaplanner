import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

/// Paleta e tema visual replicando a identidade do sistema web
/// (Angular): charcoal + gold + off-white, tipografia serifada nos
/// títulos e sans-serif no corpo, cantos levemente arredondados,
/// sem sombras pesadas nem gradientes.
class AppColors {
  AppColors._();

  static const charcoal = Color(0xFF2D2D2D);
  static const gold = Color(0xFFC9A96E);
  static const offWhite = Color(0xFFF7F7F6);
  static const white = Color(0xFFFFFFFF);

  static const error = Color(0xFFB3261E);
  static const success = Color(0xFF3E7A4A);

  // Cores auxiliares para status de orçamento
  static const statusRascunho = Color(0xFF9E9E9E);
  static const statusNovo = Color(0xFF5B8DEF);
  static const statusPendente = Color(0xFFD9A441);
  static const statusPreReserva = Color(0xFF8E6FCE);
  static const statusConfirmado = Color(0xFF3E7A4A);
  static const statusRecusado = Color(0xFFB3261E);
}

class AppTextStyles {
  AppTextStyles._();

  static TextStyle get titulo => GoogleFonts.cormorantGaramond(
        color: AppColors.charcoal,
        fontWeight: FontWeight.w600,
      );

  static TextStyle get corpo => GoogleFonts.inter(
        color: AppColors.charcoal,
      );
}

class AppTheme {
  AppTheme._();

  static ThemeData get light {
    final base = ThemeData.light(useMaterial3: true);

    return base.copyWith(
      scaffoldBackgroundColor: AppColors.offWhite,
      colorScheme: base.colorScheme.copyWith(
        primary: AppColors.charcoal,
        secondary: AppColors.gold,
        surface: AppColors.white,
        error: AppColors.error,
      ),
      textTheme: base.textTheme
          .apply(
            bodyColor: AppColors.charcoal,
            displayColor: AppColors.charcoal,
          )
          .copyWith(
            headlineLarge: AppTextStyles.titulo.copyWith(fontSize: 32),
            headlineMedium: AppTextStyles.titulo.copyWith(fontSize: 26),
            headlineSmall: AppTextStyles.titulo.copyWith(fontSize: 22),
            titleLarge: AppTextStyles.titulo.copyWith(fontSize: 20),
            bodyLarge: AppTextStyles.corpo.copyWith(fontSize: 16),
            bodyMedium: AppTextStyles.corpo.copyWith(fontSize: 14),
            labelLarge: AppTextStyles.corpo.copyWith(
              fontSize: 14,
              fontWeight: FontWeight.w600,
            ),
          ),
      appBarTheme: AppBarTheme(
        backgroundColor: AppColors.offWhite,
        foregroundColor: AppColors.charcoal,
        elevation: 0,
        centerTitle: false,
        titleTextStyle: AppTextStyles.titulo.copyWith(fontSize: 22),
      ),
      cardTheme: CardThemeData(
        color: AppColors.white,
        elevation: 0,
        margin: EdgeInsets.zero,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(14),
          side: BorderSide(color: Colors.black.withValues(alpha: 0.06)),
        ),
      ),
      inputDecorationTheme: InputDecorationTheme(
        filled: true,
        fillColor: AppColors.white,
        contentPadding:
            const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
        border: OutlineInputBorder(
          borderRadius: BorderRadius.circular(10),
          borderSide: BorderSide(color: Colors.black.withValues(alpha: 0.1)),
        ),
        enabledBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(10),
          borderSide: BorderSide(color: Colors.black.withValues(alpha: 0.1)),
        ),
        focusedBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(10),
          borderSide: const BorderSide(color: AppColors.gold, width: 1.4),
        ),
        errorBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(10),
          borderSide: const BorderSide(color: AppColors.error),
        ),
        labelStyle: AppTextStyles.corpo.copyWith(color: AppColors.charcoal),
      ),
      elevatedButtonTheme: ElevatedButtonThemeData(
        style: ElevatedButton.styleFrom(
          backgroundColor: AppColors.charcoal,
          foregroundColor: AppColors.white,
          padding: const EdgeInsets.symmetric(vertical: 16),
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(10),
          ),
          textStyle: AppTextStyles.corpo.copyWith(
            fontSize: 15,
            fontWeight: FontWeight.w600,
          ),
        ),
      ),
      outlinedButtonTheme: OutlinedButtonThemeData(
        style: OutlinedButton.styleFrom(
          foregroundColor: AppColors.charcoal,
          side: BorderSide(color: Colors.black.withValues(alpha: 0.2)),
          padding: const EdgeInsets.symmetric(vertical: 14, horizontal: 16),
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(10),
          ),
        ),
      ),
      dividerTheme: DividerThemeData(
        color: Colors.black.withValues(alpha: 0.08),
        thickness: 1,
      ),
      bottomNavigationBarTheme: const BottomNavigationBarThemeData(
        backgroundColor: AppColors.white,
        selectedItemColor: AppColors.charcoal,
        unselectedItemColor: Color(0xFFAFAFAF),
        selectedIconTheme: IconThemeData(color: AppColors.gold),
        showUnselectedLabels: true,
        type: BottomNavigationBarType.fixed,
        elevation: 0,
      ),
      snackBarTheme: SnackBarThemeData(
        backgroundColor: AppColors.charcoal,
        contentTextStyle: AppTextStyles.corpo.copyWith(color: Colors.white),
        behavior: SnackBarBehavior.floating,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(10),
        ),
      ),
    );
  }
}
