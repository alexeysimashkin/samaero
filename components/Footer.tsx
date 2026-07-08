export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">SamAero</h3>
            <p className="text-gray-400">Летайте с комфортом</p>
          </div>
          <div>
            <h4 className="font-semibold mb-3">Контакты</h4>
            <p className="text-gray-400">Телефон: 8-800-555-35-35</p>
            <p className="text-gray-400">Email: info@samaero.com</p>
          </div>
          <div>
            <h4 className="font-semibold mb-3">Информация</h4>
            <ul className="space-y-2 text-gray-400">
              <li>Правила перевозок</li>
              <li>Багаж</li>
              <li>Возврат билетов</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-8 pt-6 text-center text-gray-400">
          <p>&copy; 2024 SamAero. Все права защищены.</p>
        </div>
      </div>
    </footer>
  );
}
