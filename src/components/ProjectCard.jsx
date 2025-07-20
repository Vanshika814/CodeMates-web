import React from 'react';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';
import { Card, CardBody, Image, Chip } from '@heroui/react';

const ProjectCard = ({ projects }) => {
  if (!projects || projects.length === 0) {
    return (
      <div className="text-gray-400 text-center py-8 text-sm">No projects to display.</div>
    );
  }

  return (
    <div className="space-y-4">
      {projects.map((item, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ 
            delay: index * 0.1,
            duration: 0.3 
          }}
        >
          <Card className="bg-gradient-to-br from-[#2a2a2a] to-[#3d2a5c] border-none overflow-hidden">
            <CardBody className="p-0">
              <div className="relative w-full h-40 overflow-hidden">
                <Image
                  alt={item.title}
                  className="w-full h-full object-cover object-center"
                  src={item.imageUrl}
                  radius="none"
                  style={{ objectFit: 'cover' }}
                />
              </div>
              <div className="p-4">
                <h4 className="text-white font-bold text-sm mb-2">{item.title}</h4>
                <p className="text-white/80 text-xs mb-3 line-clamp-2">{item.description}</p>
                <div className="flex flex-wrap gap-1">
                  {(item.tech || item.techUsed || []).map((tech, idx) => (
                    <Chip key={idx} size="sm" variant="flat" className="text-xs bg-purple-500/20 text-purple-300">
                      {tech}
                    </Chip>
                  ))}
                </div>
              </div>
            </CardBody>
          </Card>
        </motion.div>
      ))}
    </div>
  );
};

export default ProjectCard; 