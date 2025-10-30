// Professional VS Code Interface Components
'use client';

import React, { useEffect, useState, useMemo, useRef, useCallback } from 'react';
import type { JSX } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FileText, 
  Folder, 
  FolderOpen, 
  ChevronRight, 
  ChevronDown,
  Settings,
  Search,
  GitBranch,
  Terminal,
  Circle,
  AlertTriangle,
  Info,
  X,
  Plus,
  Minimize2,
  Square,
  MoreHorizontal
} from 'lucide-react';

// Advanced syntax highlighting tokens
interface Token {
  type: 'keyword' | 'string' | 'comment' | 'number' | 'operator' | 'function' | 'variable' | 'property' | 'class' | 'import' | 'type';
  value: string;
  range: [number, number];
}

// File system structure
interface FileNode {
  name: string;
  type: 'file' | 'folder';
  children?: FileNode[];
  content?: string;
  language?: string;
  isOpen?: boolean;
  isActive?: boolean;
}

// Advanced tokenizer for multiple languages
export class AdvancedTokenizer {
  private static readonly KEYWORDS = {
    javascript: ['const', 'let', 'var', 'function', 'class', 'import', 'export', 'return', 'if', 'else', 'for', 'while', 'try', 'catch', 'async', 'await', 'true', 'false', 'null', 'undefined'],
    typescript: ['interface', 'type', 'enum', 'namespace', 'declare', 'public', 'private', 'protected', 'readonly', 'extends', 'implements'],
    react: ['useState', 'useEffect', 'useCallback', 'useMemo', 'useRef', 'Component', 'Fragment', 'Props', 'JSX']
  };

  static tokenize(code: string, language: string = 'javascript'): Token[] {
    const tokens: Token[] = [];
    let i = 0;

    while (i < code.length) {
      // Skip whitespace
      if (/\s/.test(code[i])) {
        i++;
        continue;
      }

      // Comments
      if (code.slice(i, i + 2) === '//') {
        const start = i;
        while (i < code.length && code[i] !== '\n') i++;
        tokens.push({ type: 'comment', value: code.slice(start, i), range: [start, i] });
        continue;
      }

      // Multi-line comments
      if (code.slice(i, i + 2) === '/*') {
        const start = i;
        i += 2;
        while (i < code.length - 1 && code.slice(i, i + 2) !== '*/') i++;
        i += 2;
        tokens.push({ type: 'comment', value: code.slice(start, i), range: [start, i] });
        continue;
      }

      // Strings
      if (code[i] === '"' || code[i] === "'" || code[i] === '`') {
        const quote = code[i];
        const start = i;
        i++;
        while (i < code.length && code[i] !== quote) {
          if (code[i] === '\\') i += 2;
          else i++;
        }
        i++;
        tokens.push({ type: 'string', value: code.slice(start, i), range: [start, i] });
        continue;
      }

      // Numbers
      if (/\d/.test(code[i])) {
        const start = i;
        while (i < code.length && /[\d.]/.test(code[i])) i++;
        tokens.push({ type: 'number', value: code.slice(start, i), range: [start, i] });
        continue;
      }

      // Identifiers and keywords
      if (/[a-zA-Z_$]/.test(code[i])) {
        const start = i;
        while (i < code.length && /[a-zA-Z0-9_$]/.test(code[i])) i++;
        const value = code.slice(start, i);
        
        let type: Token['type'] = 'variable';
        if (this.KEYWORDS.javascript.includes(value) || this.KEYWORDS.typescript.includes(value)) {
          type = 'keyword';
        } else if (this.KEYWORDS.react.includes(value)) {
          type = 'function';
        } else if (/^[A-Z]/.test(value)) {
          type = 'class';
        } else if (code[i] === '(') {
          type = 'function';
        }

        tokens.push({ type, value, range: [start, i] });
        continue;
      }

      // Operators
      if (/[+\-*/%=<>!&|^~?:;,.]/.test(code[i])) {
        const start = i;
        // Handle multi-character operators
        if (i < code.length - 1) {
          const twoChar = code.slice(i, i + 2);
          if (['===', '!==', '>=', '<=', '&&', '||', '++', '--', '=>', '??'].includes(twoChar)) {
            i += 2;
            tokens.push({ type: 'operator', value: code.slice(start, i), range: [start, i] });
            continue;
          }
        }
        i++;
        tokens.push({ type: 'operator', value: code.slice(start, i), range: [start, i] });
        continue;
      }

      // Default: single character
      i++;
    }

    return tokens;
  }

  static renderTokens(tokens: Token[]): JSX.Element[] {
    return tokens.map((token, index) => {
      const className = this.getTokenClassName(token.type);
      return (
        <span key={index} className={className}>
          {token.value}
        </span>
      );
    });
  }

  private static getTokenClassName(type: Token['type']): string {
    const classes = {
      keyword: 'text-purple-400 font-medium',
      string: 'text-green-400',
      comment: 'text-gray-500 italic',
      number: 'text-blue-300',
      operator: 'text-cyan-300',
      function: 'text-yellow-300',
      variable: 'text-blue-200',
      property: 'text-cyan-200',
      class: 'text-orange-300 font-medium',
      import: 'text-purple-300',
      type: 'text-teal-300'
    };
    return classes[type] || 'text-gray-300';
  }
}

// IntelliSense suggestion component
interface IntelliSenseProps {
  suggestions: Array<{
    label: string;
    kind: 'function' | 'variable' | 'class' | 'interface' | 'snippet';
    detail?: string;
    documentation?: string;
  }>;
  position: { x: number; y: number };
  visible: boolean;
  selectedIndex: number;
}

export const IntelliSense: React.FC<IntelliSenseProps> = ({ 
  suggestions, 
  position, 
  visible, 
  selectedIndex 
}) => {
  if (!visible || suggestions.length === 0) return null;

  const getKindIcon = (kind: string) => {
    switch (kind) {
      case 'function': return '𝑓';
      case 'variable': return '𝑥';
      case 'class': return 'C';
      case 'interface': return 'I';
      case 'snippet': return '◊';
      default: return '•';
    }
  };

  const getKindColor = (kind: string) => {
    switch (kind) {
      case 'function': return 'text-yellow-400';
      case 'variable': return 'text-blue-400';
      case 'class': return 'text-orange-400';
      case 'interface': return 'text-cyan-400';
      case 'snippet': return 'text-purple-400';
      default: return 'text-gray-400';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -10, scale: 0.95 }}
      className="absolute z-50 bg-gray-800 border border-gray-600 rounded-md shadow-2xl max-h-64 overflow-y-auto min-w-[300px]"
      style={{ left: position.x, top: position.y }}
    >
      {suggestions.map((suggestion, index) => (
        <motion.div
          key={index}
          className={`flex items-center px-3 py-2 text-sm cursor-pointer transition-colors ${
            index === selectedIndex 
              ? 'bg-blue-600 text-white' 
              : 'text-gray-300 hover:bg-gray-700'
          }`}
          whileHover={{ x: 2 }}
        >
          <span className={`mr-3 font-mono text-xs ${getKindColor(suggestion.kind)}`}>
            {getKindIcon(suggestion.kind)}
          </span>
          <div className="flex-1 min-w-0">
            <div className="font-medium truncate">{suggestion.label}</div>
            {suggestion.detail && (
              <div className="text-xs text-gray-400 truncate">{suggestion.detail}</div>
            )}
          </div>
          {suggestion.kind && (
            <span className="text-xs text-gray-500 ml-2">{suggestion.kind}</span>
          )}
        </motion.div>
      ))}
    </motion.div>
  );
};

// Error and warning indicators
interface DiagnosticProps {
  line: number;
  column: number;
  message: string;
  severity: 'error' | 'warning' | 'info';
}

export const DiagnosticIndicator: React.FC<DiagnosticProps> = ({ 
  line, 
  column, 
  message, 
  severity 
}) => {
  const getIcon = () => {
    switch (severity) {
      case 'error': return <Circle className="w-2 h-2 fill-red-500 text-red-500" />;
      case 'warning': return <AlertTriangle className="w-2 h-2 text-yellow-500" />;
      case 'info': return <Info className="w-2 h-2 text-blue-500" />;
    }
  };

  const getColor = () => {
    switch (severity) {
      case 'error': return 'border-red-500 text-red-500';
      case 'warning': return 'border-yellow-500 text-yellow-500';
      case 'info': return 'border-blue-500 text-blue-500';
    }
  };

  return (
    <div className={`inline-flex items-center border-b-2 ${getColor()}`}>
      {getIcon()}
      <span className="ml-1 text-xs">Line {line}:{column}</span>
      <div className="absolute z-50 bg-gray-900 border border-gray-600 rounded p-2 text-xs mt-6 hidden group-hover:block">
        {message}
      </div>
    </div>
  );
};

// File tree component
interface FileTreeProps {
  files: FileNode[];
  onFileSelect: (file: FileNode) => void;
  selectedFile?: string;
}

export const FileTree: React.FC<FileTreeProps> = ({ files, onFileSelect, selectedFile }) => {
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set(['src']));

  const toggleFolder = (folderName: string) => {
    setExpandedFolders(prev => {
      const newSet = new Set(prev);
      if (newSet.has(folderName)) {
        newSet.delete(folderName);
      } else {
        newSet.add(folderName);
      }
      return newSet;
    });
  };

  const renderFileNode = (node: FileNode, depth: number = 0): React.ReactElement => {
    const isExpanded = expandedFolders.has(node.name);
    const isSelected = selectedFile === node.name;

    return (
      <div key={node.name}>
        <motion.div
          className={`flex items-center py-1 px-2 cursor-pointer text-sm hover:bg-gray-700 ${
            isSelected ? 'bg-gray-600 text-white' : 'text-gray-300'
          }`}
          style={{ paddingLeft: `${depth * 16 + 8}px` }}
          onClick={() => {
            if (node.type === 'folder') {
              toggleFolder(node.name);
            } else {
              onFileSelect(node);
            }
          }}
          whileHover={{ x: 2 }}
        >
          {node.type === 'folder' ? (
            <>
              {isExpanded ? (
                <ChevronDown className="w-4 h-4 mr-1" />
              ) : (
                <ChevronRight className="w-4 h-4 mr-1" />
              )}
              {isExpanded ? (
                <FolderOpen className="w-4 h-4 mr-2 text-blue-400" />
              ) : (
                <Folder className="w-4 h-4 mr-2 text-blue-400" />
              )}
            </>
          ) : (
            <FileText className="w-4 h-4 mr-2 ml-5 text-gray-400" />
          )}
          <span className="truncate">{node.name}</span>
        </motion.div>
        {node.type === 'folder' && isExpanded && node.children && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {node.children.map(child => renderFileNode(child, depth + 1))}
          </motion.div>
        )}
      </div>
    );
  };

  return (
    <div className="bg-gray-800 h-full overflow-y-auto">
      <div className="p-3 border-b border-gray-600">
        <h3 className="text-sm font-medium text-gray-300 uppercase tracking-wide">Explorer</h3>
      </div>
      <div className="py-2">
        {files.map(file => renderFileNode(file))}
      </div>
    </div>
  );
};

// Advanced tab system
interface TabProps {
  file: FileNode;
  isActive: boolean;
  onClose: () => void;
  onClick: () => void;
  hasUnsavedChanges?: boolean;
}

export const Tab: React.FC<TabProps> = ({ 
  file, 
  isActive, 
  onClose, 
  onClick, 
  hasUnsavedChanges = false 
}) => {
  const getFileIcon = (filename: string) => {
    const ext = filename.split('.').pop()?.toLowerCase();
    switch (ext) {
      case 'js':
      case 'jsx': return '🟨';
      case 'ts':
      case 'tsx': return '🔷';
      case 'css': return '🎨';
      case 'html': return '🌐';
      case 'json': return '📋';
      case 'md': return '📝';
      default: return '📄';
    }
  };

  return (
    <motion.div
      className={`flex items-center px-3 py-2 border-r border-gray-600 cursor-pointer group relative min-w-0 ${
        isActive 
          ? 'bg-gray-900 text-white border-b-2 border-blue-500' 
          : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
      }`}
      onClick={onClick}
      whileHover={{ y: -1 }}
      layout
    >
      <span className="mr-2 text-xs">{getFileIcon(file.name)}</span>
      <span className="truncate text-sm mr-2">{file.name}</span>
      {hasUnsavedChanges && (
        <Circle className="w-2 h-2 fill-white text-white mr-2" />
      )}
      <motion.button
        className="opacity-0 group-hover:opacity-100 hover:bg-gray-500 rounded p-1 transition-opacity"
        onClick={(e) => {
          e.stopPropagation();
          onClose();
        }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        <X className="w-3 h-3" />
      </motion.button>
    </motion.div>
  );
};

// Status bar component
export const StatusBar: React.FC<{
  line: number;
  column: number;
  language: string;
  branch: string;
  errors: number;
  warnings: number;
}> = ({ line, column, language, branch, errors, warnings }) => {
  return (
    <div className="bg-blue-600 text-white text-xs flex items-center justify-between px-4 py-1">
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-1">
          <GitBranch className="w-3 h-3" />
          <span>{branch}</span>
        </div>
        {errors > 0 && (
          <div className="flex items-center space-x-1 text-red-300">
            <Circle className="w-2 h-2 fill-current" />
            <span>{errors}</span>
          </div>
        )}
        {warnings > 0 && (
          <div className="flex items-center space-x-1 text-yellow-300">
            <AlertTriangle className="w-2 h-2" />
            <span>{warnings}</span>
          </div>
        )}
      </div>
      <div className="flex items-center space-x-4">
        <span>Ln {line}, Col {column}</span>
        <span>{language}</span>
        <span>UTF-8</span>
        <span>LF</span>
      </div>
    </div>
  );
};