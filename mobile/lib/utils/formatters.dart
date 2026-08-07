import 'package:intl/intl.dart';

class Formatters {
  Formatters._();

  static final _currency = NumberFormat.currency(
    locale: 'pt_BR',
    symbol: 'R\$',
  );

  static final _date = DateFormat('dd/MM/yyyy', 'pt_BR');
  static final _dateTime = DateFormat('dd/MM/yyyy \'às\' HH:mm', 'pt_BR');

  static String currency(double value) => _currency.format(value);

  static String date(DateTime? value) =>
      value == null ? '-' : _date.format(value);

  static String dateTime(DateTime? value) =>
      value == null ? '-' : _dateTime.format(value);
}
