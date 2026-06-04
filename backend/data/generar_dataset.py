import pandas as pd
import random

# ─── SPAM en español / Perú / LATAM ───────────────────────────────────────────
spam_messages = [
    # Premios falsos
    "¡FELICITACIONES! Has sido seleccionado para ganar S/5000. Llama AHORA al 987654321 para reclamar tu premio. Válido 24 horas.",
    "GANASTE un iPhone 15 Pro en nuestro sorteo. Envía tu DNI y dirección al 956123456 para coordinamos la entrega. ¡No pierdas tu premio!",
    "Eres el ganador del sorteo de Navidad. Premio: S/10,000 en efectivo. Confirma tu número enviando SÍ al 987001122.",
    "BCP INFORMA: Tu cuenta ha sido premiada con S/2,500. Ingresa aquí para reclamar: bit.ly/premio-bcp123",
    "YAPE te regala S/50 por ser cliente fiel. Haz clic en el enlace para activar tu bono: yape-bono.net/activar",
    "Interbank sortea 3 autos 0km. Tu número fue seleccionado. Responde con tu nombre completo y DNI para participar.",
    "¡URGENTE! Tienes un paquete retenido en aduanas. Paga S/15 de liberación aquí: aduana-peru.tk/liberar",
    "Tu número ganó en el sorteo de Tottus. Recoge tu vale de S/500 presentando este mensaje en cualquier tienda.",
    "MOVISTAR: Ganaste 10GB de internet gratis. Activa tu regalo entrando a: movistar-regalo.xyz/activar ahora.",
    "Claro Premio: Acumula puntos y gana. Tu cuenta tiene 9,800 puntos. Canjea hoy en: claro-puntos.net",

    # Préstamos / dinero rápido
    "Préstamos hasta S/5,000 SIN AVAL ni fiador. Depósito en 15 minutos. WhatsApp: 998877665. Cualquier historial crediticio.",
    "¿Necesitas dinero urgente? Te prestamos S/200 a S/3,000 hoy mismo. Sin burocracia. Llama: 956443322",
    "CRÉDITO INMEDIATO aprobado para ti. S/1,000 en tu cuenta en 30 minutos. Solo necesitas tu DNI. Escríbenos ya.",
    "Financiera Sol: Préstamos rápidos sin consultar Infocorp. Tasas bajas. Contáctanos: 945123789",
    "¿Tu banco te rechazó? Nosotros sí te aprobamos. Préstamos desde S/500 hasta S/10,000. Responde QUIERO.",
    "Dinero fácil y rápido. Sin garante. Sin recibos de sueldo. Solo DNI vigente. Depósito Yape/Plin en minutos.",
    "OFERTA ESPECIAL: Préstamo de S/2,000 a pagar en 6 meses cómodas cuotas. Aplica ahora: prestamo-facil.pe",
    "Tenemos S/3,500 esperándote. Crédito aprobado en 10 minutos. WhatsApp al 987334455. ¡Sin trámites!",

    # Trabajo falso
    "TRABAJO DESDE CASA. Gana S/1,500 semanales sin experiencia. Solo necesitas celular. Inscríbete: trabajo-casa.net",
    "URGENTE: Se necesita personal para trabajar desde casa. Pago diario S/80-200. WhatsApp: 956778899",
    "Empresa internacional busca representantes en Perú. Gana en dólares desde tu celular. Info: 987221133",
    "Gana S/50 por encuesta completada. Sin horario fijo. Trabaja cuando quieras. Regístrate: encuestas-peru.com",
    "Trabajo de digitador/a desde casa. S/3 por formulario llenado. Sin límite de formularios. Únete hoy.",
    "VACANTE: Community Manager. Sin experiencia. S/1,800 mensuales + bonos. Postula por WhatsApp: 945667788",
    "Oportunidad única: Vende por Instagram y gana comisión del 40%. Sin inversión inicial. Info al 987556644",
    "Reclutamos promotores online. Gana S/500 semanales compartiendo enlaces. Fácil y rápido. Escríbenos.",

    # Phishing / suplantación de bancos
    "BCP ALERTA: Tu cuenta será bloqueada en 24h. Verifica tus datos en: bcp-seguro.xyz/verificar urgente.",
    "BBVA: Detectamos actividad sospechosa. Confirma tu clave en: bbva-alerta.net para evitar el bloqueo.",
    "Interbank Seguridad: Actualiza tu token digital AHORA o perderás acceso. Ingresa: interbank-token.com",
    "Scotiabank: Tu tarjeta fue usada en Bogotá. Si no fuiste tú, cancela en: scotiabank-fraude.tk ahora.",
    "SUNAT: Tienes una deuda pendiente de S/890. Evita multas ingresando a: sunat-deuda.net/pagar",
    "Reniec: Tu DNI vence en 3 días. Renuévalo online aquí: reniec-renovacion.xyz antes de que te multen.",
    "Tu cuenta de Yape fue comprometida. Bloquéala ingresando tu PIN en: yape-seguro.com/bloquear",
    "Plin detectó un intento de robo en tu cuenta. Confirma tu identidad: plin-verificacion.net/confirmar",
    "Falabella Financiero: Tu CMR tiene un cargo no reconocido de S/340. Disputa aquí: cmr-reclamo.xyz",

    # Apuestas / adultos
    "Betano te regala S/100 para apostar gratis. Sin depósito mínimo. Regístrate: betano-bono.pe/gratis",
    "1xBet: Bono de bienvenida del 200% en tu primer depósito. Hasta S/500 gratis. Entra ya: 1xbet-peru.net",
    "¡Gana dinero apostando al fútbol! Copa Libertadores esta noche. Cuotas increíbles. Regístrate gratis.",
    "Casino online con S/50 gratis sin depósito. Juega tragamonedas y gana premios reales. casino-pe.com",
    "Chicas disponibles cerca de ti. Ver perfiles: encuentros-peru.xyz. Registro gratis por tiempo limitado.",

    # Estafas de inversión / crypto
    "Invierte S/500 y recibe S/2,000 en 7 días. Sistema comprobado de trading con IA. WhatsApp: 987445566",
    "Bitcoin duplicador: Envía 0.01 BTC y recibe 0.02 BTC en 24h. 100% garantizado. No pierdas esta oportunidad.",
    "Gana hasta 30% mensual invirtiendo en forex. Sin conocimiento previo. Te enseñamos gratis. Escríbenos.",
    "OPORTUNIDAD: Proyecto de inversión en criptomonedas con retorno garantizado. Mínimo S/300. Info ya.",
    "Trading automatizado con IA. Gana mientras duermes. Inversión mínima S/200. Comprobantes reales. WhatsApp.",

    # Productos milagrosos
    "Pastillas para bajar 10kg en 2 semanas sin dieta ni ejercicio. Resultado garantizado o te devolvemos. Pide ya.",
    "Crema blanqueadora 100% natural. Resultados en 3 días. Delivery a todo el Perú. Pedidos: 956334411",
    "Aumenta tu talla naturalmente. Producto importado USA. Sin cirugía. Resultados en 30 días. Info: 987223344",
    "Elimina las varices en casa. Tratamiento natural. Envío gratis a Lima y provincias. Llama: 945112233",
    "Viagra genérica S/5 la pastilla. Delivery discreto. Sin receta. Pide por WhatsApp: 987667788",
    "Detox completo en 7 días. Pierde 5kg y limpia tu organismo. Kit completo S/89. Delivery gratis.",

    # Cadenas / viral
    "Reenvía este mensaje a 10 personas y Yape te depositará S/20 automáticamente. ¡Comprobado! No pierdas.",
    "BILL GATES dará S/5,000 a las primeras 1000 personas que compartan este mensaje. ¡Actúa ya!",
    "Movistar regala 5GB a quien comparta esta imagen antes de medianoche. ¡Apúrate! Solo hoy.",
    "WhatsApp cerrará las cuentas inactivas. Reenvía a 10 contactos para mantener tu cuenta activa.",
    "Alerta: virus peligroso detectado en WhatsApp. Reenvía a tus contactos para protegerlos. ¡URGENTE!",

    # Rifas / sorteos falsos
    "TINKA DIGITAL: Tu número 3847291 fue seleccionado. Premio S/15,000. Reclama antes del viernes.",
    "Pollada pro fondos: Compra tu cartón al 967554433. Premio mayor S/2,000. Sorteo este sábado.",
    "Rifa benéfica: Cartón S/5. Premio: auto Hyundai 0km. Sorteo en vivo por Facebook. Apoya la causa.",
    "Lotería Nacional: Tu serie ganó el segundo premio. Cobra en: loteria-nacional-pe.xyz con tu DNI.",

    # Otros típicos
    "Vendo cuentas de Netflix, Disney+ y Spotify premium a S/5/mes. WhatsApp: 987112233. ¡Oferta!",
    "Seguro SOAT más barato del mercado. S/120 todo el año. Legal y válido. Contáctanos: 956889900",
    "Documentos rápidos: licencias, brevetes, certificados. Consulta sin compromiso: 945778800",
    "Reparamos celulares a domicilio. iPhone y Android. Garantía escrita. WhatsApp: 987334422",
    "¡ATENCIÓN! Tu número fue seleccionado para recibir una tablet gratis. Solo paga envío S/20.",
    "Clases de inglés online S/30/mes ilimitado. Certificado internacional incluido. Info: 956223344",
    "Empleo en Canadá, España y EEUU. Te ayudamos con visa y pasajes. Consulta gratis: 987556677",
    "Venta de likes, seguidores y reproducciones reales. Paquetes desde S/20. WhatsApp: 945334411",
    "Accede a cursos universitarios gratis con certificado. Solo hoy. Regístrate: cursos-gratis.xyz",
    "Recargas de gas a domicilio más barato. Lima y Callao. Llama ahora: 956445522",
]

# ─── HAM en español / Perú / LATAM ───────────────────────────────────────────
ham_messages = [
    # Conversaciones cotidianas
    "Oye, ¿a qué hora es la reunión mañana? Me confundí con el horario.",
    "Ya llegué al paradero, espérame 5 minutos que estoy bajando del micro.",
    "¿Puedes traer pan cuando vayas al mercado? Y si hay, también trae chicha morada.",
    "Mamá, hoy voy a llegar tarde. No me esperes para cenar, come sin mí.",
    "Flaco, ¿viste el partido anoche? Qué golazo metió Guerrero, loco.",
    "Oye pasaste la práctica de cálculo? Yo no entendí nada de integrales.",
    "¿Dónde quieres reunirnos para estudiar? Puedo ir a la biblioteca de la uni.",
    "Ya deposité mi parte del alquiler. Avísame cuando lo veas en tu cuenta.",
    "Hermano me quedé sin plata, ¿puedes yapearme S/20 hasta el viernes?",
    "¿Cuál es la dirección exacta? No encuentro el lugar en el mapa.",
    "Mañana hay huelga de transportes, mejor sal temprano o busca otra ruta.",
    "Che, ¿sabes si la PUCP tiene convenio con el BCP para préstamos estudiantiles?",
    "Mi mamá hizo caldo de gallina, ven a comer si quieres, hay bastante.",
    "Bro, presta tu apunte de historia, mañana es el examen y no fui a clases.",
    "¿A qué hora abre Wong los domingos? Quiero ir a comprar antes de que cierren.",
    "Ya pedí el Rappi, llega en 30 minutos. ¿Quieres que te pida algo también?",
    "Acabo de ver tu historia. ¿Dónde queda ese restaurante? Se veía rico.",
    "Recuerda que el miércoles es el cumple de tu abuela. No vayas a olvidar.",
    "Mi Yape no funciona bien, te mando por Plin mejor. Dame tu número.",
    "¿Fuiste al médico? ¿Qué te dijeron? Espero que no sea nada serio.",

    # Trabajo / estudio real
    "Buenos días equipo, la reunión de hoy se pasa a las 4pm por zoom. Misma sala.",
    "Por favor envíen el informe antes del jueves. El cliente lo necesita ese día.",
    "Jefa, voy a llegar 15 minutos tarde, el tráfico en la Javier Prado está fatal.",
    "¿Ya subiste tu parte del trabajo grupal al drive? Necesito revisarlo hoy.",
    "La profesora canceló la clase de mañana. Avisa al resto del salón.",
    "Me aprobaron las vacaciones del 15 al 22. ¿Puedes cubrirme esos días?",
    "Recuerda entregar el contrato firmado antes del mediodía. Gracias.",
    "El cliente confirmó la reunión para el martes a las 10am en sus oficinas.",
    "¿Tienes el número de RUC de la empresa? Lo necesito para la factura.",
    "Mañana es el último día para registrarse en el seminario. Pasa la voz.",

    # Familia
    "Hijita, ya estoy llegando a casa. ¿Quieres que compre algo en el camino?",
    "Amor, ¿confirmaste la reserva del restaurante para el sábado? Son 6 personas.",
    "Mamá dice que vayas este fin de semana, hace tiempo no la visitas.",
    "¿Cómo le fue en el colegio a Rodrigo? ¿Le fue bien en la evaluación?",
    "Papá, ¿puedes recoger a mi hermana del colegio? Yo salgo tarde del trabajo.",
    "Ya puse la olla en el fuego. Llegas en media hora no? Para que esté listo.",
    "Oye, el agua se cortó en el edificio hasta las 6pm. Avisa a todos.",
    "Mi abuela está en el hospital, cualquier cosa les aviso. Gracias por preguntar.",
    "Este fin de semana vamos a Lurín. ¿Vienen o no? Confirmen para separar lugar.",
    "¿Cuánto te debo del mercado? Dime para hacerte la transferencia hoy.",

    # Salud real
    "Doctora, confirmando mi cita para el martes 10am. ¿Sigo en ayunas?",
    "Me recetaron amoxicilina 500mg cada 8 horas. ¿Tú sabes dónde está más barato?",
    "Ya saqué cita en EsSalud para el jueves. Tengo que ir en ayunas.",
    "¿Sabes si el policlínico de San Isidro atiende los sábados? Para la niña.",
    "Me dieron de alta. Gracias por estar pendiente. Ya estoy en casa descansando.",

    # Noticias / información real
    "Oye, ¿viste que mañana hay paro de transporte en Lima? Mejor trabaja desde casa.",
    "La UNI abrió inscripciones para el preuniversitario. Avísale a tu primo.",
    "Subió el precio del dólar a S/3.85. Mejor cambia tu plata ahora si puedes.",
    "Hay descuento en Plaza Vea hasta el domingo. 30% en electrodomésticos.",
    "Bro el profe puso las notas en el portal. Entra a revisar las tuyas.",
    "Mañana hay simulacro de sismo a las 10am. No te asustes si escuchas la alarma.",
    "Cortaron la luz en el barrio hasta las 3pm por mantenimiento. Avisa en casa.",

    # Transporte / lugares
    "El micro 36 ya no pasa por Angamos. Tienes que tomar el 56 o el corredor.",
    "En el aeropuerto hay cola enorme en migraciones. Llega con 3 horas de anticipación.",
    "¿Sabes si hay Metropolitano de noche? Tengo que llegar a Chorrillos.",
    "El taxi de la app me cobra S/18 a Miraflores. ¿Te parece mucho?",
    "Hay desvío en la Av. Arequipa por las obras del metro. Toma otra ruta.",

    # Ocio / entretenimiento real
    "¿Vamos al cine el viernes? Están pasando la nueva de Marvel en Cineplanet.",
    "El partido de la U es el domingo a las 3pm. ¿Lo ves en casa o en el estadio?",
    "Che, ¿conoces algún buen sitio para comer ceviche en Barranco no muy caro?",
    "Me recomendaron una serie en Netflix, se llama El juego del calamar. ¿La viste?",
    "Este finde hay Festival Metropolitano en el Parque de la Exposición. ¿Vamos?",
    "¿Alguien tiene entrada para el concierto de Daddy Yankee? Venden doble.",
    "Acabo de escuchar el nuevo álbum de Bad Bunny. Está buenazo, escúchalo.",

    # Compras / trámites reales
    "Oye, en Saga Falabella hay remate de ropa de temporada. Por si te interesa.",
    "¿Sabes cuánto cuesta renovar el brevete en Lima? ¿Hay que sacar cita?",
    "Me llegó mi tarjeta del banco. ¿Cómo la activo? No encuentro el instructivo.",
    "En el Makro están vendiendo aceite más barato que en el mercado. Aprovecha.",
    "¿Cuánto cobra el gasista para instalar un balón nuevo? El mío se acabó.",
    "Mi laptop se malogró, ¿dónde la mando a reparar que sea confiable en Lima?",
    "¿Sabes si en el Ministerio atienden con cita previa o van directo a la cola?",
    "La tienda de Ripley tiene 12 cuotas sin intereses. Por si quieres aprovechar.",
    "Encontré un depa en San Miguel de S/800 al mes, con servicios incluidos. ¿Interesa?",
    "¿Tu mecánico es bueno? El mío me cobró carísimo el cambio de aceite.",

    # Mensajes cortos / casuales
    "Jajaja eso estuvo gracioso, me muero.",
    "Ya entendí, gracias por explicarme.",
    "Perfecto, nos vemos entonces el lunes.",
    "Okey, confirmo para las 7pm.",
    "Gracias, ya lo vi. Todo bien por aquí.",
    "Un momento, ahorita te respondo.",
    "¿Cómo estás? Tiempo sin saber de ti.",
    "Bendiciones para ti también, cuídate.",
    "Avísame cuando llegues, que te vaya bien.",
    "Eso está genial, felicitaciones en serio.",
    "No te preocupes, pasa sin querer.",
    "Ya pues, cuando puedas no hay apuro.",
    "Recién me levanto, ¿qué me perdí?",
    "Eso mero, tienes razón compadre.",
    "Hermano ya voy para allá, espérame.",
]

# ─── Construir DataFrame balanceado ──────────────────────────────────────────
random.seed(42)

# Duplicar spam con variaciones para balancear un poco
spam_extended = spam_messages.copy()
for msg in spam_messages[:40]:
    variations = [
        msg.replace("S/", "soles ").replace("!", " !!"),
        msg.upper(),
        msg.lower(),
        "URGENTE: " + msg,
        msg + " Responde YA.",
    ]
    spam_extended.append(random.choice(variations))

# Agregar variaciones de ham también
ham_extended = ham_messages.copy()
for msg in ham_messages[:40]:
    ham_extended.append(msg + " Saludos.")

data = (
    [("spam", msg) for msg in spam_extended] +
    [("ham",  msg) for msg in ham_extended]
)

random.shuffle(data)
df = pd.DataFrame(data, columns=["label", "text"])

# Guardar
df.to_csv("/home/claude/spam_espanol.tsv", sep="\t", index=False, header=False)

# Stats
total   = len(df)
n_spam  = (df["label"] == "spam").sum()
n_ham   = (df["label"] == "ham").sum()
print(f"Total mensajes : {total}")
print(f"SPAM           : {n_spam}  ({n_spam/total*100:.1f}%)")
print(f"HAM            : {n_ham}   ({n_ham/total*100:.1f}%)")
print(f"\nEjemplos SPAM:")
print(df[df["label"]=="spam"]["text"].sample(3, random_state=1).to_string(index=False))
print(f"\nEjemplos HAM:")
print(df[df["label"]=="ham"]["text"].sample(3, random_state=1).to_string(index=False))
