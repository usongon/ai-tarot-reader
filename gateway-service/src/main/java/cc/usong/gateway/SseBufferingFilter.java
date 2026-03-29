package cc.usong.gateway;

import jakarta.servlet.*;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

import java.io.IOException;

/**
 * SSE 流式响应过滤器：禁用代理/Servlet 缓冲，确保逐字输出。
 */
@Component
@Order(Ordered.HIGHEST_PRECEDENCE)
public class SseBufferingFilter implements Filter {

    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
            throws IOException, ServletException {
        HttpServletRequest httpRequest = (HttpServletRequest) request;
        HttpServletResponse httpResponse = (HttpServletResponse) response;

        if (httpRequest.getRequestURI().contains("/stream")) {
            httpResponse.setHeader("X-Accel-Buffering", "no");
            httpResponse.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
            httpResponse.setHeader("Connection", "keep-alive");
        }

        chain.doFilter(request, response);
    }
}
