
import React, { useState } from 'react';
import { X, Plus } from 'lucide-react';
import { Badge } from '../../../components/ui/badge';
import { motion, AnimatePresence } from 'framer-motion';

const POPULAR_SKILLS = [
  'React', 'Node.js', 'JavaScript', 'TypeScript', 'Python', 'Java',
  'PHP', 'Laravel', 'Vue.js', 'Angular', 'MongoDB', 'MySQL',
  'PostgreSQL', 'AWS', 'Docker', 'Kubernetes', 'Git', 'UI/UX Design',
  'Figma', 'Adobe XD', 'Photoshop', 'Illustrator', 'Content Writing',
  'SEO', 'Digital Marketing', 'WordPress', 'Shopify', 'Flutter'
];

export const SkillSelector = ({ selectedSkills = [], onChange, maxSkills = 10 }) => {
  const [inputValue, setInputValue] = useState('');
  const [filteredSuggestions, setFilteredSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const handleInputChange = (e) => {
    const value = e.target.value;
    setInputValue(value);

    if (value.trim()) {
      const filtered = POPULAR_SKILLS.filter(
        skill => 
          skill.toLowerCase().includes(value.toLowerCase()) &&
          !selectedSkills.includes(skill)
      );
      setFilteredSuggestions(filtered);
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }
  };

  const addSkill = (skill) => {
    if (selectedSkills.length < maxSkills && !selectedSkills.includes(skill)) {
      onChange([...selectedSkills, skill]);
      setInputValue('');
      setShowSuggestions(false);
    }
  };

  const removeSkill = (skillToRemove) => {
    onChange(selectedSkills.filter(skill => skill !== skillToRemove));
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && inputValue.trim()) {
      e.preventDefault();
      addSkill(inputValue.trim());
    }
  };

  return (
    <div className="w-full">
      {/* Selected Skills */}
      {selectedSkills.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-3">
          <AnimatePresence>
            {selectedSkills.map((skill) => (
              <motion.div
                key={skill}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
              >
                <Badge 
                  className="bg-brand text-white pr-1 flex items-center gap-1"
                >
                  {skill}
                  <button
                    onClick={() => removeSkill(skill)}
                    className="ml-1 rounded-full hover:bg-white/20 p-0.5 transition-colors"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Input */}
      <div className="relative">
        <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 focus-within:border-brand dark:focus-within:border-brand-light transition-colors">
          <Plus className="w-4 h-4 text-brand flex-shrink-0" />
          <input
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder={selectedSkills.length < maxSkills ? "Add skills..." : `Max ${maxSkills} skills`}
            disabled={selectedSkills.length >= maxSkills}
            className="flex-1 bg-transparent text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:outline-none text-sm disabled:opacity-50"
          />
        </div>

        {/* Suggestions Dropdown */}
        {showSuggestions && filteredSuggestions.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute z-10 w-full mt-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg max-h-60 overflow-y-auto"
          >
            {filteredSuggestions.map((skill) => (
              <button
                key={skill}
                onClick={() => addSkill(skill)}
                className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                {skill}
              </button>
            ))}
          </motion.div>
        )}
      </div>

      {/* Helper Text */}
      <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">
        {selectedSkills.length}/{maxSkills} skills added
      </p>
    </div>
  );
};
