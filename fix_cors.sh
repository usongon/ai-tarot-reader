#!/bin/bash
# 修复CORS问题的脚本

# 在服务器上创建CORS配置文件
ssh root@101.37.119.177 << 'EOF'
# 创建配置目录
mkdir -p ~/tarot-reader/backend/src/main/java/com/example/tarotreader/config

# 创建CORS配置文件
cat > ~/tarot-reader/backend/src/main/java/com/example/tarotreader/config/WebConfig.java << 'CONFIG_END'
package com.example.tarotreader.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig {

    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/api/**")
                        .allowedOrigins("*")
                        .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                        .allowedHeaders("*")
                        .allowCredentials(false);
            }
        };
    }
}
CONFIG_END

echo "CORS配置文件已创建"
EOF

# 重新打包并上传后端
cd /Users/usongon/IdeaProjects/ai-tarot-reader/backend
# 如果有Maven环境，重新打包
if command -v mvn &> /dev/null; then
    mvn clean package -DskipTests
    # 上传新的JAR文件
    scp target/tarot-reader-0.0.1-SNAPSHOT.jar root@101.37.119.177:~/tarot-reader/backend/
else
    echo "本地没有Maven环境，跳过本地打包步骤"
fi

# 在服务器上重启服务
ssh root@101.37.119.177 << 'EOF'
# 停止现有服务
pkill -f "tarot-reader-0.0.1-SNAPSHOT.jar"

# 如果有新的JAR文件，使用新文件
if [ -f "~/tarot-reader/backend/tarot-reader-0.0.1-SNAPSHOT.jar" ]; then
    cd ~/tarot-reader/backend
    nohup java -jar tarot-reader-0.0.1-SNAPSHOT.jar > app.log 2>&1 &
    echo "使用新的JAR文件启动服务"
else
    echo "没有找到新的JAR文件，跳过重启"
fi

# 重启Nginx
sudo systemctl restart nginx
echo "Nginx已重启"

# 检查服务状态
sleep 5
echo "=== 服务状态 ==="
ps aux | grep java | grep -v grep
sudo systemctl status nginx --no-pager
EOF