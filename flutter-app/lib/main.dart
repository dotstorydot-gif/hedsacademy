import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:supabase_flutter/supabase_flutter.dart';
import 'package:google_fonts/google_fonts.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();

  // Initialize Supabase
  // In a real app, these should be in a .env file or similar
  await Supabase.initialize(
    url: 'https://yspuhrrqoswjlfancqrj.supabase.co',
    anonKey: 'sb_publishable_6NGbZdeBS93HRpXC5jKw8w_LK5Uw4cs',
  );

  runApp(
    const ProviderScope(
      child: HedsAcademyApp(),
    ),
  );
}

class HedsAcademyApp extends StatelessWidget {
  const HedsAcademyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'HEDS Academy',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        colorScheme: ColorScheme.fromSeed(
          seedColor: const Color(0xFF000000),
          primary: const Color(0xFF000000),
          secondary: const Color(0xFFB8860B), // Brand Gold/Yellow
          surface: Colors.white,
          brightness: Brightness.light,
        ),
        useMaterial3: true,
        textTheme: GoogleFonts.outfitTextTheme(
          Theme.of(context).textTheme,
        ).copyWith(
          displayLarge: GoogleFonts.michroma(),
          displayMedium: GoogleFonts.michroma(),
          headlineLarge: GoogleFonts.michroma(fontWeight: FontWeight.bold),
          headlineMedium: GoogleFonts.michroma(fontWeight: FontWeight.bold),
        ),
      ),
      darkTheme: ThemeData(
        colorScheme: ColorScheme.fromSeed(
          seedColor: const Color(0xFFFFFFFF),
          primary: const Color(0xFFFFFFFF),
          secondary: const Color(0xFFB8860B),
          surface: const Color(0xFF121212),
          brightness: Brightness.dark,
        ),
        useMaterial3: true,
        textTheme: GoogleFonts.outfitTextTheme(
          Theme.of(context).textTheme,
        ).copyWith(
          displayLarge: GoogleFonts.michroma(),
          displayMedium: GoogleFonts.michroma(),
          headlineLarge: GoogleFonts.michroma(fontWeight: FontWeight.bold),
          headlineMedium: GoogleFonts.michroma(fontWeight: FontWeight.bold),
        ),
      ),
      home: const AuthWrapper(),
    );
  }
}

class AuthWrapper extends ConsumerWidget {
  const AuthWrapper({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final session = Supabase.instance.client.auth.currentSession;

    if (session == null) {
      return const LoginScreen();
    } else {
      return const DashboardScreen();
    }
  }
}

class LoginScreen extends StatelessWidget {
  const LoginScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            const Icon(Icons.school, size: 80, color: Color(0xFF6366F1)),
            const SizedBox(height: 24),
            Text(
              'HEDS Academy',
              style: Theme.of(context).textTheme.headlineLarge?.copyWith(
                fontWeight: FontWeight.bold,
              ),
            ),
            const SizedBox(height: 12),
            const Text('Empowering the future of learning'),
            const SizedBox(height: 48),
            ElevatedButton(
              onPressed: () {
                // TODO: Implement Login
              },
              style: ElevatedButton.styleFrom(
                minimumSize: const Size(200, 50),
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(12),
                ),
              ),
              child: const Text('Sign In'),
            ),
          ],
        ),
      ),
    );
  }
}

class DashboardScreen extends StatelessWidget {
  const DashboardScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Dashboard'),
        actions: [
          IconButton(
            onPressed: () async {
              await Supabase.instance.client.auth.signOut();
            },
            icon: const Icon(Icons.logout),
          ),
        ],
      ),
      body: const Center(
        child: Text('Welcome to HEDS Academy Mobile'),
      ),
    );
  }
}
