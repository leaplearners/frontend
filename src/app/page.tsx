import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-400 via-purple-500 to-pink-400">
      {/* Header */}
      <header className="container mx-auto px-6 py-4">
        <nav className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-yellow-400 rounded-full flex items-center justify-center">
              <span className="text-2xl">🎓</span>
            </div>
            <h1 className="text-2xl font-bold text-white">LeapLearner</h1>
          </div>
          <div className="hidden md:flex space-x-6">
            <Link
              href="/sign-in"
              className="text-white hover:text-yellow-300 transition-colors"
            >
              Sign In
            </Link>
            <Link
              href="/sign-up"
              className="bg-yellow-400 text-purple-800 px-4 py-2 rounded-full font-semibold hover:bg-yellow-300 transition-colors"
            >
              Get Started
            </Link>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <main className="container mx-auto px-6 py-12">
        <div className="text-center mb-16">
          <h2 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
            Learning is
            <span className="block text-yellow-300">Super Fun!</span>
          </h2>
          <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-3xl mx-auto">
            Join thousands of kids discovering the joy of learning with
            interactive lessons, exciting quizzes, and amazing tutors!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/sign-up"
              className="bg-yellow-400 text-purple-800 px-8 py-4 rounded-full text-xl font-bold hover:bg-yellow-300 transition-all transform hover:scale-105 shadow-lg"
            >
              Start Learning Free! 🚀
            </Link>
            <Link
              href="/sign-in"
              className="border-2 border-white text-white px-8 py-4 rounded-full text-xl font-semibold hover:bg-white hover:text-purple-800 transition-all"
            >
              I'm a Tutor 👨‍🏫
            </Link>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-8 text-center hover:transform hover:scale-105 transition-all">
            <div className="w-16 h-16 bg-pink-400 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">📚</span>
            </div>
            <h3 className="text-2xl font-bold text-white mb-3">Fun Lessons</h3>
            <p className="text-white/80">
              Interactive videos and games that make learning exciting and
              memorable!
            </p>
          </div>

          <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-8 text-center hover:transform hover:scale-105 transition-all">
            <div className="w-16 h-16 bg-green-400 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">🎯</span>
            </div>
            <h3 className="text-2xl font-bold text-white mb-3">
              Smart Quizzes
            </h3>
            <p className="text-white/80">
              Test your knowledge with fun quizzes and earn cool badges!
            </p>
          </div>

          <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-8 text-center hover:transform hover:scale-105 transition-all">
            <div className="w-16 h-16 bg-blue-400 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">👥</span>
            </div>
            <h3 className="text-2xl font-bold text-white mb-3">Live Tutors</h3>
            <p className="text-white/80">
              Connect with friendly tutors who make learning personal and fun!
            </p>
          </div>
        </div>

        {/* Subjects Section */}
        <div className="text-center mb-16">
          <h3 className="text-4xl font-bold text-white mb-8">
            What Can You Learn?
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { emoji: "🔢", name: "Math", color: "bg-red-400" },
              { emoji: "🔬", name: "Science", color: "bg-blue-400" },
              { emoji: "📖", name: "Reading", color: "bg-green-400" },
              { emoji: "🌍", name: "History", color: "bg-yellow-400" },
            ].map((subject, index) => (
              <div
                key={index}
                className={`${subject.color} rounded-2xl p-6 hover:transform hover:scale-110 transition-all cursor-pointer`}
              >
                <div className="text-4xl mb-2">{subject.emoji}</div>
                <div className="font-bold text-white">{subject.name}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Testimonials */}
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 mb-16">
          <h3 className="text-3xl font-bold text-white text-center mb-8">
            What Kids Say! 😊
          </h3>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white/20 rounded-xl p-6">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-pink-300 rounded-full flex items-center justify-center mr-4">
                  <span className="text-xl">👧</span>
                </div>
                <div>
                  <div className="font-bold text-white">Emma, 8</div>
                  <div className="text-yellow-300">⭐⭐⭐⭐⭐</div>
                </div>
              </div>
              <p className="text-white/90 italic">
                "I love the math games! They make numbers so much fun. My tutor
                is super nice too!"
              </p>
            </div>
            <div className="bg-white/20 rounded-xl p-6">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-blue-300 rounded-full flex items-center justify-center mr-4">
                  <span className="text-xl">👦</span>
                </div>
                <div>
                  <div className="font-bold text-white">Alex, 10</div>
                  <div className="text-yellow-300">⭐⭐⭐⭐⭐</div>
                </div>
              </div>
              <p className="text-white/90 italic">
                "Science experiments are awesome! I learned about volcanoes and
                made one at home!"
              </p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <div className="bg-gradient-to-r from-yellow-400 to-orange-400 rounded-2xl p-8">
            <h3 className="text-3xl font-bold text-purple-800 mb-4">
              Ready to Start Your Learning Adventure? 🎉
            </h3>
            <p className="text-purple-700 text-xl mb-6">
              Join thousands of happy learners today!
            </p>
            <Link
              href="/sign-up"
              className="bg-purple-800 text-white px-8 py-4 rounded-full text-xl font-bold hover:bg-purple-700 transition-all transform hover:scale-105 inline-block"
            >
              Start Learning Now! 🚀
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="container mx-auto px-6 py-8 mt-16">
        <div className="text-center text-white/70">
          <p>© 2024 LeapLearner. Making learning fun for every child! 🌟</p>
        </div>
      </footer>
    </div>
  );
}
