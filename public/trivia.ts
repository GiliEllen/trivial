async function fetchTrivia(e: Event) {
    e.preventDefault();
  
    const difficultySelect = document.getElementById('difficulty') as HTMLSelectElement;
    const topicSelect = document.getElementById('topic') as HTMLSelectElement;
  
    const difficulty = difficultySelect.value;
    const topic = topicSelect.value;
  
    try {
      const response = await fetch(`/api/trivia/${topic}/${difficulty}`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch trivia: ${response.statusText}`);
      }
  
      const trivia = await response.json();
      window.location.href = `/trivia.html?${topic}?${difficulty}`;
      console.log('Fetched trivia:', trivia);
  
    } catch (error) {
      console.error('Error fetching trivia:', error);
    }
  }